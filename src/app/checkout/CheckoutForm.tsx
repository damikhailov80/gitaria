"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { user } from "@/lib/mock/user";
import styles from "./page.module.css";

const methods = [
  { id: "card", label: "Карта" },
  { id: "blik", label: "BLIK" },
  { id: "p24", label: "Przelewy24" },
] as const;

type Method = (typeof methods)[number]["id"];

/** Payment form per the design. Payment isn't connected yet — submitting does nothing. */
export function CheckoutForm({ price }: { price: string }) {
  const [method, setMethod] = useState<Method>("card");

  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      <div className="field">
        <label className="field-label" htmlFor="email">
          Электронная почта
        </label>
        <input id="email" type="email" className="input" defaultValue={user.email} autoComplete="email" />
      </div>

      <fieldset className="field">
        <legend className={`field-label ${styles.legend}`}>Способ оплаты</legend>
        <div className="segmented">
          {methods.map((m) => (
            <label key={m.id}>
              <input type="radio" name="method" checked={method === m.id} onChange={() => setMethod(m.id)} />
              {m.label}
            </label>
          ))}
        </div>
      </fieldset>

      {method === "card" && (
        <>
          <div className="field">
            <label className="field-label" htmlFor="card-number">
              Номер карты
            </label>
            <input
              id="card-number"
              className="input"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 1234 1234 1234"
            />
          </div>
          <div className={styles.row}>
            <div className="field">
              <label className="field-label" htmlFor="card-exp">
                Срок
              </label>
              <input id="card-exp" className="input" autoComplete="cc-exp" placeholder="ММ / ГГ" />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="card-cvc">
                CVC
              </label>
              <input id="card-cvc" className="input" inputMode="numeric" autoComplete="cc-csc" placeholder="123" />
            </div>
          </div>
        </>
      )}

      <button type="submit" className="btn btn-primary btn-block btn-lg">
        Оплатить {price}
      </button>
      <p className={styles.secure}>
        <Icon name="lock" size={20} />
        Платёж обрабатывает Stripe. Данные карты не хранятся на сайте.
      </p>
    </form>
  );
}
