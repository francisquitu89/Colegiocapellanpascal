import React from "react";
import { ArrowLeft } from 'lucide-react';

interface Props {
  ciclo: "primer" | "segundo" | "tercer";
  onBack?: () => void;
}

const urls = {
  primer:
    "https://calendar.google.com/calendar/u/0/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=America/Santiago&src=Y2FsZW5kYXJpb3ByaW1lcmNpY2xvQHNzY2NtYW5xdWVodWUuY2w&src=Y19paHBubDI2aXY3aGYwZmNkZ2psNGUyc2xpZ0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Y19zZXNybm1ocm85aHA2cjI1cm85MGJ2N3JrMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZXMuY2wjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23039BE5&color=%23009688&color=%238E24AA&color=%230B8043&showCalendars=0&title=Calendario+de+evidencias",
  segundo:
    "https://calendar.google.com/calendar/u/0/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=America/Santiago&src=Y2FsZW5kYXJpb3NlZ3VuZG9jaWNsb0Bzc2NjbWFucXVlaHVlLmNs&src=Y18zMm5wMTVuYmhqMDhrcWxpdG8yMTkzdmNhY0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Y19nMXRma3IzczJuZnE0azBoMWQ1NXFvbmk4MEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Y19nMHBrbGFlczhnZHVvbTl1NjB2b2ppaDgya0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Y19hZWpmcGF1amtqNG5tNHU2a2Zic2M0ZXUyZ0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Y19hcGszdjM1dmJ0dDVua29yYmZxZmYwYnU4MEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Y19tYjFmdTVpcXM3dHJhbWQ4YXMxcGxnZWpyNEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23039BE5&color=%237CB342&color=%23D50000&color=%23EF6C00&color=%238E24AA&color=%237CB342&color=%23B39DDB&title=Calendario+Evaluaciones",
  tercer:
    "https://calendar.google.com/calendar/u/0/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=America/Santiago&src=Y2FsZW5kYXJpb3RlcmNlcmNpY2xvQHNzY2NtYW5xdWVodWUuY2w&src=Y19waGpwajE0dDA4a3BuMmt1b3EwMWExbmNvMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Y19ydHFvYzVtb2RpMzVpZXIyaWZ2MjA2YTB2Y0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Y185cjkzamUzMm9rajQxZDE0Mm5uazJoNjI1a0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Y185NWRsZWQ2djEwNW1oM3V0ZGZtYmdrNHE5a0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Y19hY2s4dXJhNnFlZ2o4N24waXRoampxOXI2NEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Y19lNWF0ZzBrYW1xc2JxbzZyaG1zc3VmYTI3b0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Y18zdGcxcDFrMTV2ajJta20zMmN1ZjlnbDF0NEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23039BE5&color=%239E69AF&color=%23F4511E&color=%23C0CA33&color=%23D50000&color=%234285F4&color=%237CB342&color=%23EF6C00&title=Calendario+Evaluaciones"
};

const titulos = {
  primer: "Calendario Primer Ciclo",
  segundo: "Calendario Segundo Ciclo",
  tercer: "Calendario Tercer Ciclo"
};

export default function CalendarioCicloSection({ ciclo, onBack }: Props) {
  return (
    <section className="max-w-3xl mx-auto mt-12 mb-12 p-6 bg-white rounded-xl shadow-lg border border-blue-100">
      <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">{titulos[ciclo]}</h2>
      <iframe
        src={urls[ciclo]}
        style={{ border: 0 }}
        width="100%"
        height="600"
        frameBorder="0"
        scrolling="no"
        title={titulos[ciclo]}
      ></iframe>
      <div className="mt-6 flex justify-center">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-4 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </button>
      </div>
    </section>
  );
}
