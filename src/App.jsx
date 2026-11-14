import { useState } from "react";
import emailjs from "@emailjs/browser";
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const WHATSAPP_NUMBER = "212616504875";

export default function App() {
  const [data, setData] = useState({ name: "", email: "", message: "", phone: "" });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, data, PUBLIC_KEY)
      setStatus("success");
      setData({ name: "", email: "", message: "", phone: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };


  const handleWhatsApp = () => {
    const form = document.getElementById("contact-form");
    if (!form.reportValidity()) return;

    const text =
      `Nouveau message\n` +
      `Nom : ${data.name}\n` +
      `E-mail : ${data.email}\n` +
      `Téléphone : ${data.phone}\n` +
      `Message : ${data.message}`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: 12, maxWidth: 400 }}
    >
      <input name="name" placeholder="Votre nom" value={data.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Votre e-mail" value={data.email} onChange={handleChange} required />
      <input
        name="phone"
        type="tel"
        value={data.phone}
        placeholder="+212XXXXXXXXX"
        onChange={handleChange}
        pattern="\+?[0-9]{9,15}"
        title="Entrez un numéro valide, par exemple +212612345678"
        required
      />
      <textarea name="message" rows={5} placeholder="Votre message" value={data.message} onChange={handleChange} required />

      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Envoi..." : "Envoyer par e-mail"}
      </button>

      <button
        type="button"
        onClick={handleWhatsApp}
        style={{ background: "#25D366", color: "white", border: "none", padding: 10}}
      >
        Envoyer par WhatsApp
      </button>

      {status === "success" && <p>Message envoyé ✅</p>}
      {status === "error" && <p>Erreur, réessayez ❌</p>}
    </form>
  );
}