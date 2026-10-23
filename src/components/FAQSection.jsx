//src/components/FAQSection.jsx
import { faqs } from "@/data/content";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

export default function FAQSection({ limit }) {
  const list = limit ? faqs.slice(0, limit) : faqs;
  return (
    <section className="section-y">
      <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading
            align="left"
            eyebrow="Good to know"
            title="Questions, answered"
            text="Everything first-time visitors usually ask before booking a ride or a shoot."
            className="mb-0 sm:mb-0 lg:sticky lg:top-32"
          />
        </div>
        <Reveal className="lg:col-span-8">
          <Accordion type="single" collapsible defaultValue="item-0">
            {list.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
