import { FaBolt, FaLock, FaFilePdf } from "react-icons/fa";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-logo">
        <FaFilePdf />
      </div>

      <h1>PDF Toolbox</h1>

      <p>
        Merge, Split, Compress and Convert PDFs
        directly in your browser.
      </p>

      <div className="hero-badges">
        <span>
          <FaBolt /> Fast
        </span>

        <span>
          <FaLock /> Secure
        </span>

        <span>🆓 Free</span>
      </div>
    </section>
  );
}

export default Hero;