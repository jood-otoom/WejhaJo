"use client";

import {
  CalendarDays,
  Check,
  FileText,
  MapPin,
  MessageSquare,
  Plus,
  Send,
  Trophy,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  inventory,
  orders,
  sampleQuestions,
  suppliers,
  venues,
} from "@/data/showcases";

const money = new Intl.NumberFormat("en-JO", {
  style: "currency",
  currency: "JOD",
  maximumFractionDigits: 0,
});
const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
const shortcuts = [
  /onboard|new (teammate|hire|staff)/i,
  /approv|purchas/i,
  /report|issue|service desk/i,
];
type Exchange = { prompt: string; answerIndex: number };

export function Knowledge() {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState<Exchange[]>([]);
  function ask(prompt: string, answerIndex: number) {
    setConversation((previous) => [
      ...previous.slice(-4),
      { prompt, answerIndex },
    ]);
    setQuery("");
  }
  function send(event: FormEvent) {
    event.preventDefault();
    const prompt = query.trim();
    if (prompt)
      ask(
        prompt,
        shortcuts.findIndex((rule) => rule.test(normalize(prompt))),
      );
  }
  return (
    <section className="demo-panel full-demo" aria-label="Knowledge assistant">
      <header className="demo-heading">
        <h3>
          <MessageSquare size={21} /> Knowledge assistant
        </h3>
        <span className="sample-label">Illustrative data</span>
      </header>
      <div className="demo-controls" role="group" aria-label="Sample questions">
        {sampleQuestions.map(({ question }, index) => (
          <button
            type="button"
            className="filter"
            key={question}
            onClick={() => ask(question, index)}
          >
            {question}
          </button>
        ))}
      </div>
      <div className="chat-history" role="log" aria-label="Conversation">
        {conversation.length === 0 && (
          <p className="chat-empty">
            Choose a sample question to explore the example handbook,
            procurement policy or IT guide.
          </p>
        )}
        {conversation.map(({ prompt, answerIndex }, index) => {
          const reference = sampleQuestions[answerIndex];
          return (
            <div className="chat-exchange" key={`${index}-${prompt}`}>
              <p className="chat-user">{prompt}</p>
              <div className="chat-answer">
                {reference ? (
                  <>
                    <p>{reference.answer}</p>
                    <details className="source-card">
                      <summary>
                        <FileText size={15} /> {reference.source} · Page{" "}
                        {reference.page}
                      </summary>
                      <p>{reference.excerpt}</p>
                    </details>
                  </>
                ) : (
                  <p>
                    This preview covers onboarding, purchase approvals and
                    system issues. Try a sample question to see the supporting
                    source.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <form className="chat-form" onSubmit={send}>
        <label className="sr-only" htmlFor="knowledge-question">
          Your question
        </label>
        <input
          id="knowledge-question"
          value={query}
          maxLength={180}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask about an example document"
        />
        <button type="submit" className="button" disabled={!query.trim()}>
          Ask <Send size={16} />
        </button>
      </form>
      <p className="demo-note">
        Questions, responses and source excerpts use local sample content.
      </p>
    </section>
  );
}

const bookingDays = [
  { id: "2026-12-04", day: "Fri", date: "Dec 4" },
  { id: "2026-12-05", day: "Sat", date: "Dec 5" },
  { id: "2026-12-06", day: "Sun", date: "Dec 6" },
  { id: "2026-12-07", day: "Mon", date: "Dec 7" },
  { id: "2026-12-08", day: "Tue", date: "Dec 8" },
] as const;
type Venue = (typeof venues)[number];
type BookingDay = (typeof bookingDays)[number];
type Reservation = { venue: Venue; day: BookingDay; time: string };

export function Booking() {
  const [view, setView] = useState<"Browse venues" | "My bookings">(
    "Browse venues",
  );
  const [sport, setSport] = useState("All sports");
  const [venue, setVenue] = useState<Venue>(venues[0]);
  const [day, setDay] = useState<BookingDay>(bookingDays[0]);
  const [time, setTime] = useState("");
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [status, setStatus] = useState("");
  const visibleVenues = venues.filter(
    (item) => sport === "All sports" || sport === item.sport,
  );
  const booked = (slot: string) =>
    bookings.some(
      (item) =>
        item.venue.id === venue.id &&
        item.day.id === day.id &&
        item.time === slot,
    );
  const available = venue.slots.filter(
    (_, index) => index !== bookingDays.indexOf(day) - 1,
  );

  return (
    <section className="demo-panel full-demo" aria-label="GoTime booking demo">
      <header className="demo-heading">
        <h3>
          <Trophy size={21} /> GoTime booking demo
        </h3>
        <span className="sample-label">Illustrative data</span>
      </header>
      <div className="booking-shell">
        <div className="booking-top">
          <strong>GoTime</strong>
          <span>
            <MapPin size={14} /> Amman
          </span>
        </div>
        <div className="demo-controls" role="group" aria-label="Booking view">
          {(["Browse venues", "My bookings"] as const).map((item) => (
            <button
              className="filter"
              type="button"
              aria-pressed={view === item}
              key={item}
              onClick={() => {
                setView(item);
                setStatus("");
              }}
            >
              {item}
            </button>
          ))}
        </div>
        {view === "Browse venues" ? (
          <>
            <label className="demo-label">
              Sport
              <select
                value={sport}
                onChange={(event) => {
                  const value = event.target.value;
                  setSport(value);
                  setVenue(
                    venues.find((item) => item.sport === value) ?? venues[0],
                  );
                  setTime("");
                  setStatus("");
                }}
              >
                <option>All sports</option>
                {venues.map((item) => (
                  <option key={item.id}>{item.sport}</option>
                ))}
              </select>
            </label>
            <div className="venue-list" role="group" aria-label="Venues">
              {visibleVenues.map((item) => (
                <button
                  type="button"
                  aria-pressed={venue.id === item.id}
                  className="venue-button"
                  key={item.id}
                  onClick={() => {
                    setVenue(item);
                    setTime("");
                    setStatus("");
                  }}
                >
                  <strong>{item.name}</strong>
                  <span>
                    {item.sport} · {item.area} · {money.format(item.price)}
                  </span>
                </button>
              ))}
            </div>
            <h4 className="chart-title">
              <CalendarDays size={16} /> December 2026
            </h4>
            <div
              className="booking-days"
              role="group"
              aria-label="Booking date"
            >
              {bookingDays.map((item) => (
                <button
                  type="button"
                  className="filter"
                  key={item.id}
                  aria-pressed={day.id === item.id}
                  onClick={() => {
                    setDay(item);
                    setTime("");
                    setStatus("");
                  }}
                >
                  <span>{item.day}</span>
                  <strong>{item.date}</strong>
                </button>
              ))}
            </div>
            <div className="demo-controls" role="group" aria-label="Time slots">
              {available.map((slot) => (
                <button
                  className="filter"
                  type="button"
                  aria-pressed={time === slot}
                  disabled={booked(slot)}
                  key={slot}
                  onClick={() => {
                    setTime(slot);
                    setStatus("");
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="button booking-submit"
              disabled={!time}
              onClick={() => {
                if (!time || booked(time)) return;
                setBookings([...bookings, { venue, day, time }]);
                setTime("");
                setView("My bookings");
                setStatus("Sample booking added.");
              }}
            >
              <Plus size={17} /> Book selected time
            </button>
          </>
        ) : (
          <div className="booking-list">
            {bookings.length ? (
              bookings.map((item) => (
                <div
                  className="booking-record"
                  key={`${item.venue.id}-${item.day.id}-${item.time}`}
                >
                  <div>
                    <strong>{item.venue.name}</strong>
                    <p>
                      {item.day.date} · {item.time} · Confirmed
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-link"
                    aria-label={`Cancel booking for ${item.venue.name} on ${item.day.date} at ${item.time}`}
                    onClick={() => {
                      setBookings(bookings.filter((record) => record !== item));
                      setStatus("Sample booking cancelled.");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ))
            ) : (
              <p>No sample bookings yet.</p>
            )}
          </div>
        )}
        <p className="demo-status" role="status">
          {status && (
            <>
              <Check size={16} />
              {status}
            </>
          )}
        </p>
      </div>
      <p className="demo-note">
        Bookings are illustrative and reset when you reload the page.
      </p>
    </section>
  );
}

const procurementViews = ["Purchase orders", "Suppliers", "Inventory"] as const;

export function Procurement() {
  const [view, setView] =
    useState<(typeof procurementViews)[number]>("Purchase orders");
  const [status, setStatus] = useState("All statuses");
  const filtered = orders.filter(
    (order) => status === "All statuses" || order.status === status,
  );

  return (
    <section
      className="demo-panel full-demo"
      aria-label="Procurement workspace"
    >
      <header className="demo-heading">
        <h3>Procurement workspace</h3>
        <span className="sample-label">Illustrative data</span>
      </header>
      <div className="demo-controls" role="group" aria-label="Procurement view">
        {procurementViews.map((item) => (
          <button
            className="filter"
            type="button"
            key={item}
            aria-pressed={item === view}
            onClick={() => setView(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {view === "Purchase orders" && (
        <label className="demo-label status-filter">
          Order status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {["All statuses", "Delivered", "In transit", "In review"].map(
              (item) => (
                <option key={item}>{item}</option>
              ),
            )}
          </select>
        </label>
      )}
      <div className="data-table">
        {view === "Purchase orders" && (
          <table>
            <caption className="sr-only">Purchase orders</caption>
            <thead>
              <tr>
                <th>Order</th>
                <th>Supplier / item</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <th scope="row">{item.id}</th>
                  <td>
                    {item.supplier}
                    <small>{item.item}</small>
                  </td>
                  <td>{money.format(item.total)}</td>
                  <td>
                    <span className="order-status" data-status={item.status}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {view === "Suppliers" && (
          <table>
            <caption className="sr-only">Supplier directory</caption>
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Category</th>
                <th>Lead time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((item) => (
                <tr key={item.name}>
                  <th scope="row">{item.name}</th>
                  <td>{item.category}</td>
                  <td>{item.leadTime}</td>
                  <td>
                    <span className="order-status" data-status={item.status}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {view === "Inventory" && (
          <table>
            <caption className="sr-only">Inventory overview</caption>
            <thead>
              <tr>
                <th>Item</th>
                <th>Available</th>
                <th>Reorder at</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.sku}>
                  <th scope="row">
                    {item.name}
                    <small>{item.sku}</small>
                  </th>
                  <td>{item.available}</td>
                  <td>{item.reorder}</td>
                  <td>
                    <span
                      className="order-status"
                      data-status={
                        item.available < item.reorder ? "In review" : "Approved"
                      }
                    >
                      {item.available < item.reorder ? "Reorder" : "In stock"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
