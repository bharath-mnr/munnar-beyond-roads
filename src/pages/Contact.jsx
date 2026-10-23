//src/pages/Contact.jsx
import { useState } from "react";
import { CalendarDays, Instagram, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";

import { site, whatsappLink } from "@/data/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

const interests = [
  { value: "Jeep safari", label: "Jeep safari" },
  { value: "Photography", label: "Photography" },
  { value: "Stay / tour package", label: "Stay & tours" },
  { value: "Safari + photography", label: "Safari + photos" },
];

const initial = {
  name: "",
  phone: "",
  date: "",
  guests: "",
  interest: "Jeep safari",
  message: "",
};

function buildMessage(f) {
  return [
    `Hi Munnar Beyond Roads! I'd like to enquire about: ${f.interest}.`,
    "",
    `Name: ${f.name}`,
    `Phone: ${f.phone}`,
    f.date && `Preferred date: ${f.date}`,
    f.guests && `Guests: ${f.guests}`,
    f.message && `Notes: ${f.message}`,
  ]
    .filter((line) => line !== false && line !== undefined)
    .join("\n");
}

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "Please tell us your name.";
    if (!/^[+\d][\d\s-]{6,}$/.test(form.phone.trim()))
      er.phone = "Enter a valid phone number.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = (channel) => (e) => {
    e.preventDefault();
    if (!validate()) return;
    const text = buildMessage(form);
    if (channel === "whatsapp") {
      window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
    } else {
      const subject = encodeURIComponent(`Enquiry: ${form.interest}`);
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${encodeURIComponent(text)}`;
    }
    setSent(true);
  };

  const info = [
    {
      Icon: MessageCircle,
      label: "WhatsApp",
      value: site.phones[0].display,
      href: whatsappLink(),
    },
    ...site.phones.map((p) => ({
      Icon: Phone,
      label: "Call",
      value: p.display,
      href: `tel:${p.tel}`,
    })),
    { Icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    {
      Icon: Instagram,
      label: "Instagram",
      value: site.instagramHandle,
      href: site.instagram,
    },
    { Icon: MapPin, label: "Based in", value: site.location },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        art="dusk"
        title="Let's plan your ride"
        text="Call, WhatsApp or send an enquiry. Tell us your dates and group size and we'll reply with a clear plan and timings."
      />

      <section className="section-y">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* info */}
          <div className="min-w-0 space-y-4 lg:col-span-5">
            {info.map(({ Icon, label, value, href }, i) => {
              const inner = (
                <Card className="flex-row items-center gap-5 p-5 transition-all duration-300 hover:border-accent hover:shadow-lg">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
                      {label}
                    </p>
                    <p className="mt-0.5 font-semibold [overflow-wrap:anywhere]">{value}</p>
                  </div>
                </Card>
              );
              return (
                <Reveal key={`${label}-${value}`} delay={i * 70}>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="block"
                    >
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </Reveal>
              );
            })}

            <Reveal className="overflow-hidden rounded-2xl border">
              <iframe
                title="Munnar on the map"
                src="https://maps.google.com/maps?q=Munnar%2C%20Kerala&t=&z=11&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="aspect-[16/10] w-full border-0 sm:aspect-[4/3]"
              />
            </Reveal>
          </div>

          {/* form */}
          <Reveal className="min-w-0 lg:col-span-7">
            <Card className="gap-0 p-6 sm:p-10">
              <h2 className="font-display text-3xl font-semibold">Send an enquiry</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your message opens in WhatsApp or your email app, ready to send.
              </p>

              <form className="mt-8 grid grid-cols-1 gap-6" noValidate onSubmit={submit("whatsapp")}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="name">Your name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Full name"
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="phone">Phone / WhatsApp *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="+91 …"
                      autoComplete="tel"
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="date">
                      <CalendarDays className="size-4" /> Preferred date
                    </Label>
                    <Input id="date" type="date" value={form.date} onChange={set("date")} />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="guests">Number of guests</Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      inputMode="numeric"
                      value={form.guests}
                      onChange={set("guests")}
                      placeholder="e.g. 4"
                    />
                  </div>
                </div>

                <fieldset className="grid grid-cols-1 gap-3">
                  <legend className="mb-1 text-sm font-semibold">I'm interested in</legend>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((o) => {
                      const active = form.interest === o.value;
                      return (
                        <button
                          key={o.value}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setForm((f) => ({ ...f, interest: o.value }))}
                          className={cn(
                            "rounded-full border px-5 py-2.5 text-sm font-semibold transition-all",
                            active
                              ? "border-primary bg-primary text-primary-foreground shadow-md"
                              : "bg-card hover:border-primary/50 hover:bg-secondary",
                          )}
                        >
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="message">Anything we should know?</Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Group makeup, special occasion, pickup point, must-see places…"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button type="submit" variant="accent" size="lg" className="sm:flex-1">
                    <MessageCircle /> Send via WhatsApp
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="sm:flex-1"
                    onClick={submit("email")}
                  >
                    <Send /> Send via email
                  </Button>
                </div>

                {sent && (
                  <p
                    role="status"
                    className="rounded-xl bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground"
                  >
                    Thanks! Your enquiry is ready to send — just hit send in the app that opened.
                  </p>
                )}
              </form>
            </Card>
          </Reveal>
        </div>
      </section>
    </>
  );
}
