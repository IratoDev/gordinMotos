
import { useState } from "react";
import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

export default function Footer() {
  const [cookies, setCookies] = useState(
    !localStorage.getItem("cookies-accepted")
  );

  const [socialOpen, setSocialOpen] = useState({
    facebook: false,
    instagram: false,
    whatsapp: false,
  });

  function acceptCookies() {
    localStorage.setItem("cookies-accepted", "true");
    setCookies(false);
  }

  const contact = [
    { icon: <FaPhone />, text: "(43)99952-9363" },
    { icon: <FaWhatsapp />, text: "(43)99917-5256" },
    { icon: <FaEnvelope />, text: "gordinmotos01@gmail.com" },
    {
      icon: <FaMapMarkerAlt />,
      text: "Avenida Maracanã, 3530, Vila Araponguinha - Arapongas/PR",
    },
  ];

  const menu = [
    { label: "Estoque", href: "/multipla" },
    { label: "Avaliação", href: "/avaliacao" },
    { label: "Financiamento", href: "/financiamento" },
    { label: "Quem somos", href: "/empresa" },
    { label: "Contato", href: "/contato" },
  ];

  const social = [
    {
      label: "Instagram",
      href: "https://www.instagram.com/gordinmotosmultimarcas/",
      icon: <FaInstagram />,
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/p/Gordinho-MOTOS-61555825864294/",
      icon: <FaFacebook />,
    },
  ];

  const lateral = [
    {
      id: "facebook" as const,
      label: "Acesse nosso Facebook",
      value: "Clique aqui",
      href: "https://www.facebook.com/p/Gordinho-MOTOS-61555825864294/",
      icon: <FaFacebook />,
    },
    {
      id: "instagram" as const,
      label: "Siga-nos no Instagram",
      value: "Clique aqui",
      href: "https://www.instagram.com/gordinmotosmultimarcas/",
      icon: <FaInstagram />,
    },
    {
      id: "whatsapp" as const,
      label: "WhatsApp Web",
      value: "(43)99917-5256",
      href: "https://wa.me/5543999175256",
      icon: <FaWhatsapp />,
    },
  ];

  return (
    <footer className="bg-black text-white">

      {/* Informações principais */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-3">

        {/* Atendimento */}
        <section>
          <h3 className="mb-5 text-xl font-bold">Atendimento</h3>

          <ul className="space-y-4 text-sm text-cinza-300">
            {contact.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-1 text-vermelho-500">
                  {item.icon}
                </span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Menu */}
        <section>
          <h3 className="mb-5 text-xl font-bold">Menu</h3>

          <ul className="space-y-3 text-sm text-cinza-300">
            {menu.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="transition hover:text-vermelho-500"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Redes sociais */}
        <section>
          <h3 className="mb-5 text-xl font-bold">Redes sociais</h3>

          <ul className="space-y-4">
            {social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-cinza-300 transition hover:text-vermelho-500"
                >
                  {item.icon}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Marcas e modelos */}
      <div className="border-t border-cinza-800 px-6 py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <section>
            <h3 className="mb-3 text-lg font-bold">Marcas</h3>
          </section>

          <section>
            <h3 className="mb-3 text-lg font-bold">Modelos</h3>
          </section>
        </div>
      </div>

      {/* Horário */}
      <div className="bg-cinza-900 px-6 py-5 text-center text-sm text-cinza-300">
        <p>
          HORÁRIO DE ATENDIMENTO:{" "}
          <strong>Segunda à sexta:</strong> 08:00 às 18:00
          {" | "}
          <strong>Sábados:</strong> 08:00 às 13:00
        </p>
      </div>

      {/* Desenvolvedor */}
      <div className="px-6 py-5 text-center text-sm text-cinza-400">
        Desenvolvido por{" "}
        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:text-white"
        >
          IratoDev
        </a>
      </div>

      {/* Redes sociais laterais */}
      <div className="fixed right-0 top-1/3 z-40 hidden flex-col gap-2 md:flex">
        {lateral.map((item) => (
          <div key={item.id} className="flex items-center justify-end">
            {socialOpen[item.id] && (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-l-lg bg-cinza-900 px-4 py-3 text-sm text-white"
              >
                {item.label}
                <strong className="block">{item.value}</strong>
              </a>
            )}

            <button
              type="button"
              onClick={() =>
                setSocialOpen((prev) => ({
                  ...prev,
                  [item.id]: !prev[item.id],
                }))
              }
              className="flex h-12 w-12 items-center justify-center bg-vermelho-600 text-xl text-white"
              aria-label={item.label}
            >
              {item.icon}
            </button>
          </div>
        ))}
      </div>

      {/* WhatsApp mobile */}
      <a
        href="https://wa.me/5543999175256"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-lg md:hidden"
        aria-label="WhatsApp"
      >
        <FaWhatsapp />
      </a>

      {/* Cookies */}
      {cookies && (
        <div className="fixed bottom-0 left-0 z-50 w-full bg-white p-5 text-cinza-900 shadow-2xl">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm">
              Para proteger e melhorar sua experiência, utilizamos cookies
              e dados pessoais de acordo com nossos{" "}
              <a
                href="/politica-de-privacidade"
                target="_blank"
                className="font-bold underline"
              >
                Termos de Uso e Política de Privacidade
              </a>.
            </p>

            <button
              onClick={acceptCookies}
              className="rounded-lg bg-vermelho-600 px-6 py-2 font-semibold text-white hover:bg-vermelho-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
