import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";


class CustomError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

interface User {
  token: string;
  accessToken: string;
  id: number;
  cedula: string;
  email: string;
  // contrasenia: string; // Removido para evitar enviar contraseñas
  fechaNacimiento: [number, number, number];
  estado: string;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  idInstitucion: {
    id: number;
    nombre: string;
  };
  idPerfil: {
    permisos: Array<{
      id: number;
      tipoPermiso: string;
    }>;
    id: number;
    nombrePerfil: string;
    estado: string;
  };
  usuariosTelefonos: Array<{
    id: number;
    numero: string;
  }>;
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usuario: { label: "Usuario", type: "text" },
        password: { label: "Password", type: "password" }
      },

      
      async authorize(credentials){
        const hashedPassword = credentials ? crypto.createHash('sha256').update(credentials.password).digest('hex') : '';
        const res = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario: credentials?.usuario,
            password: hashedPassword
          })
        });

        const data = await res.json();
        if (res.ok && data && data.user.estado === "ACTIVO") {
          // Transformar los datos según el formato deseado
          const transformedData = {
            id: data.user.id,
            name: data.user.nombre,
            email: data.user.email,
            // No hay campo image en data.user, por lo que se elimina
            data: {
              ...data.user,
            },
            expires: data.expires,
            accessToken: data.token
          };
          return transformedData as any;
        } else if ( res.status === 401) {
          throw new CustomError(data.error);
        } else if (data.user.estado === "INACTIVO") {
          throw new CustomError("Cuenta inactiva, por favor contacte al administrador");
        } else {
          throw new CustomError("Error desconocido, por favor intente nuevamente");
        }
        
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }): Promise<any> {
      if (account?.provider === "google") {
        try {
          const res = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/google-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: profile?.email, name: profile?.name }),
          });

          const text = await res.text(); // primero como texto

          let data;
          try {
            data = JSON.parse(text);
          } catch (e) {
            console.error("Respuesta no es JSON válido:", text);
            return `/auth/signin?error=${encodeURIComponent("El servidor no respondió correctamente")}`;
          }

          if (data.userNeedsAdditionalInfo) {
            // Redirigir al registro si el usuario no está completo
            const email = encodeURIComponent(profile?.email ?? '');
            const fullName = (profile?.name ?? '').split(' ');
            const nombre = encodeURIComponent(fullName[0] ?? '');
            const apellido = encodeURIComponent(fullName.slice(1).join(' ') ?? '');

            return `/auth/signup?email=${email}&nombre=${nombre}&apellido=${apellido}`;
          }

          if (data.error === "Cuenta inactiva, por favor contacte al administrador") {
            // Redirigir al login con mensaje de cuenta inactiva
            return `/auth/signin?error=${encodeURIComponent("Cuenta inactiva, por favor contacte al administrador")}`;
          }

          if (!data || !data.token || !data.user) {
            // Usuario no encontrado
            return `/auth/signin?error=${encodeURIComponent("Tu cuenta no está registrada. Por favor regístrate.")}`;
          }

          // Usuario válido
          user.accessToken = data.token;
          user.data = data.user;
          return { ...user.data, accessToken: data.token };

        } catch (err) {
          console.error("Error en signIn con Google:", err);
          return `/auth/signin?error=${encodeURIComponent("Error inesperado al iniciar sesión con Google")}`;
        }
      }

      return true; // Para otros proveedores como Credentials
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.data?.id; // 👈 ID del usuario
        token.idPerfil = user.data?.idPerfil?.id; // 👈 ID del perfil
        token.user = {
          id: user.data?.id,
          name: user.data?.nombre,
          email: user.data?.email,
          idPerfil: user.data?.idPerfil?.id, // 👈 importante
          accessToken: user.accessToken,
        };
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user = {
        id: token.id,
        name: token.user?.name,
        email: token.user?.email,
        idPerfil: token.idPerfil,
        accessToken: token.accessToken,
        data: token.user,
      };
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,// 8 hs de expiracion
  },
  secret: process.env.SECRET,
  jwt: {
    secret: process.env.SECRET
  }
});

export { handler as GET, handler as POST };
