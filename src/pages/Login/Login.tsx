import {Loader2} from "lucide-react";
import {useState} from "react";
import {useNavigate} from "react-router";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {supabase} from "@/supabaseClient";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    const {error} = await supabase.auth.signInWithPassword({email, password});

    if (error) {
      setAuthError(error.message);
      setLoading(false);
    } else {
      setLoading(false);
      await navigate("/dashboard");
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setAuthError(null);
    const {error} = await supabase.auth.signUp({email, password});
    if (error) {
      setAuthError(error.message);
    } else {
      alert("Cadastro realizado! Verifique seu email para confirmação.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Entre com seu email e senha para acessar sua lista de desejos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            void handleLogin(e);
          }}
          >
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  disabled={loading}
                />
              </div>
              {authError && <p className="text-sm text-red-500">{authError}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Entrar
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={() => {
                  void handleSignUp();
                }}
                disabled={loading}
              >
                Criar conta
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
