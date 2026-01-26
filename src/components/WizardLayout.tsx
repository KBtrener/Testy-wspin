import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import ProgressBar from "./ProgressBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import logoKbt from "../assets/logokbt.png";

interface WizardLayoutProps {
  title: string;
  stepIndex: number;
  totalSteps: number;
  backPath?: string;
  nextPath?: string;
  warning?: string;
  children: React.ReactNode;
}

const WizardLayout = ({
  title,
  stepIndex,
  totalSteps,
  backPath,
  nextPath,
  warning,
  children
}: WizardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reset } = useAppStore();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-card/95 p-6 shadow-xl">
      <div className="flex flex-col items-center gap-2">
        <img src={logoKbt} alt="KBTrener logo" className="h-16 w-auto" />
        <div className="text-lg font-semibold text-foreground">
          KB - Testy dla wspinaczy
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          <Badge
            variant="outline"
            className="mt-2 w-fit bg-muted/70 text-muted-foreground"
          >
            Krok {stepIndex} / {totalSteps}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/step/summary">Dashboard</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/step/athlete">Początek</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/standards">Standardy</Link>
          </Button>
          <Button variant="ghost" size="sm" type="button" onClick={() => reset()}>
            Wyczyść dane
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <ProgressBar current={stepIndex} total={totalSteps} />
      </div>
      <div className="mt-6 space-y-6">{children}</div>
      {warning && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {warning}
        </div>
      )}
      <div className="sticky bottom-0 z-10 -mx-6 mt-6 flex items-center justify-between gap-3 bg-card/95 px-6 py-4 backdrop-blur md:static md:z-auto md:mx-0 md:bg-transparent md:px-0 md:py-0">
        <Button
          variant="secondary"
          onClick={() => backPath && navigate(backPath)}
          disabled={!backPath}
        >
          Wstecz
        </Button>
        {nextPath && (
          <Button onClick={() => navigate(nextPath)}>Dalej</Button>
        )}
      </div>
      <div className="mt-6 border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
        © {currentYear} KBTrener - Karol Bilecki
      </div>
    </div>
  );
};

export default WizardLayout;
