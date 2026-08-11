"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  History,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
  UserCheck,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { BUSINESS_HOURS_END, BUSINESS_HOURS_START, MIN_APPOINTMENT_NOTICE_HOURS } from "@/lib/business-rules";
import { getInitials } from "@/lib/utils";
import type { ConvenienceUser } from "@/lib/user-cookie";
import type { User } from "@/types/api";

const FEATURES = [
  {
    icon: Calendar,
    title: "Agendamento em minutos",
    description: "Escolha o serviço, o horário e confirme — sem ligações, sem espera.",
  },
  {
    icon: Scissors,
    title: "Escolha seu barbeiro",
    description: "Veja o perfil e as qualificações de cada barbeiro antes de marcar.",
  },
  {
    icon: Sparkles,
    title: "Diversas qualificações",
    description: "Corte, barba e outros serviços, cada um com sua própria grade de horários.",
  },
  {
    icon: History,
    title: "Histórico completo",
    description: "Acompanhe seus agendamentos passados e futuros em um só lugar.",
  },
];

const BENEFITS = [
  { icon: UserCheck, text: "Cadastro rápido, sem burocracia" },
  { icon: ShieldCheck, text: "Cancelamento fácil dentro do prazo" },
  { icon: Calendar, text: "Disponibilidade de horários em tempo real" },
];

const FAQ_ITEMS = [
  {
    question: "Como faço para agendar um horário?",
    answer:
      "Crie sua conta, escolha o barbeiro e o serviço desejado e selecione um horário disponível na agenda. A confirmação é imediata.",
  },
  {
    question: "Preciso criar conta para agendar?",
    answer:
      "Sim. O cadastro é rápido — leva menos de um minuto — e depois disso você já pode ver os horários disponíveis e agendar.",
  },
  {
    question: "Posso cancelar ou remarcar um agendamento?",
    answer: `Você pode cancelar um agendamento pela página "Meus agendamentos" até ${MIN_APPOINTMENT_NOTICE_HOURS}h antes do horário marcado.`,
  },
  {
    question: "Como escolho o barbeiro?",
    answer:
      'Na página "Barbeiros" você pode ver o perfil e as qualificações de cada profissional antes de marcar seu horário.',
  },
  {
    question: "Qual o horário de funcionamento?",
    answer: `Atendemos todos os dias, das ${BUSINESS_HOURS_START}h às ${BUSINESS_HOURS_END}h.`,
  },
  {
    question: "Como é feito o pagamento?",
    answer: "O pagamento é feito presencialmente, na barbearia, no momento do atendimento.",
  },
];

const LOCATION_INFO = [
  {
    icon: MapPin,
    title: "Endereço",
    lines: ["Av. Paulista, 1106 – Bela Vista", "São Paulo – SP"],
  },
  {
    icon: Clock,
    title: "Horário de funcionamento",
    lines: [`Todos os dias`, `${BUSINESS_HOURS_START}h às ${BUSINESS_HOURS_END}h`],
  },
  {
    icon: Phone,
    title: "Telefone",
    lines: ["(11) 4002-8922"],
  },
  {
    icon: Mail,
    title: "E-mail",
    lines: ["contato@clickbeard.com"],
  },
];

/** Home (spec §5, §13.4) — landing page accessible to both visitors and authenticated users; only the header/hero/footer CTA changes with the session. */
export function PublicHome() {
  const { user, optimisticUser, logout } = useAuth();
  const router = useRouter();
  const displayUser = user ?? optimisticUser;

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader displayUser={displayUser} onLogout={handleLogout} />

      <main className="flex-1">
        <section className="border-b border-border bg-muted/40">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-20 text-center md:px-6 md:py-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Scissors className="size-3.5 text-secondary" aria-hidden="true" />
              Sistema de agendamento para barbearia
            </span>
            <h1 className="max-w-2xl text-4xl leading-tight font-semibold text-balance md:text-5xl">
              Agende seu horário na barbearia sem complicação
            </h1>
            <p className="max-w-xl text-base text-muted-foreground md:text-lg">
              Escolha o barbeiro, o serviço e o horário que preferir, e acompanhe todos os seus
              agendamentos em um único lugar.
            </p>
            {displayUser ? (
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard aria-hidden="true" />
                  Ir para o painel
                </Link>
              </Button>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/register">Criar conta</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl">Tudo que você precisa para agendar</h2>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Recursos pensados para deixar sua experiência simples do início ao fim.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-accent">
                    <Icon className="size-5 text-secondary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-muted/40">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-2 md:px-6 md:py-20">
            <div className="flex flex-col justify-center gap-4">
              <h2 className="text-2xl font-semibold md:text-3xl">Por que usar o ClickBeard</h2>
              <p className="text-sm text-muted-foreground md:text-base">
                Menos tempo organizando, mais tempo cuidando do visual.
              </p>
              <ul className="space-y-3">
                {BENEFITS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-card ring-1 ring-border">
                      <Icon className="size-4 text-secondary" aria-hidden="true" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <Card className="justify-center">
              <CardContent className="flex flex-col items-center gap-4 text-center">
                {displayUser ? (
                  <>
                    <h3 className="text-xl font-semibold">Pronto para agendar?</h3>
                    <p className="text-sm text-muted-foreground">
                      Escolha o barbeiro, o serviço e o horário que preferir.
                    </p>
                    <Button asChild>
                      <Link href="/book">Agendar agora</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold">Pronto para começar?</h3>
                    <p className="text-sm text-muted-foreground">
                      Crie sua conta gratuitamente e marque seu primeiro horário agora mesmo.
                    </p>
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                      <Button asChild>
                        <Link href="/register">Criar conta</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/login">Já tenho conta</Link>
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl">Perguntas frequentes</h2>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Não achou o que procurava? Fale com a gente pelos contatos abaixo.
            </p>
          </div>
          <Accordion type="single" collapsible>
            {FAQ_ITEMS.map(({ question, answer }) => (
              <AccordionItem key={question} value={question}>
                <AccordionTrigger>{question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="border-t border-border bg-muted/40">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-semibold md:text-3xl">Onde estamos</h2>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Venha nos visitar ou entre em contato.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {LOCATION_INFO.map(({ icon: Icon, title, lines }) => (
                <Card key={title}>
                  <CardHeader>
                    <div className="flex size-10 items-center justify-center rounded-lg bg-accent">
                      <Icon className="size-5 text-secondary" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-base">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {lines.map((line) => (
                      <p key={line} className="text-sm text-muted-foreground">
                        {line}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter displayUser={displayUser} />
    </div>
  );
}

interface PublicHeaderProps {
  displayUser: User | ConvenienceUser | null;
  onLogout: () => void;
}

function PublicHeader({ displayUser, onLogout }: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Scissors className="size-5 text-secondary" aria-hidden="true" />
        ClickBeard
      </Link>
      {displayUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Menu do usuário"
            >
              <Avatar className="size-9">
                <AvatarFallback>{getInitials(displayUser.name)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <LayoutDashboard aria-hidden="true" />
                Meu painel
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserIcon aria-hidden="true" />
                Meu perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onLogout}>
              <LogOut aria-hidden="true" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Criar conta</Link>
          </Button>
        </div>
      )}
    </header>
  );
}

function PublicFooter({ displayUser }: { displayUser: User | ConvenienceUser | null }) {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-center md:flex-row md:justify-between md:px-6 md:text-left">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
          <Scissors className="size-4 text-secondary" aria-hidden="true" />
          ClickBeard
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          {displayUser ? (
            <Link href="/dashboard" className="hover:text-foreground">
              Meu painel
            </Link>
          ) : (
            <>
              <Link href="/login" className="hover:text-foreground">
                Entrar
              </Link>
              <Link href="/register" className="hover:text-foreground">
                Criar conta
              </Link>
            </>
          )}
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} ClickBeard. Sistema de agendamento para barbearia.
        </p>
      </div>
    </footer>
  );
}
