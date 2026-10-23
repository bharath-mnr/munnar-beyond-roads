//src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import PageHero from "@/components/PageHero";

export default function NotFound() {
  return (
    <PageHero
      eyebrow="Error 404"
      art="mist"
      title="You've gone beyond the roads"
      text="This trail doesn't lead anywhere — let's get you back on the map."
    >
      <Button asChild variant="accent" size="lg">
        <Link to="/">
          <ArrowLeft /> Back to home
        </Link>
      </Button>
    </PageHero>
  );
}
