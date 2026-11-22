'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ServiceKey } from '../lib/servicesData';
import { CheckCircle2, AlertCircle, Send } from 'lucide-react';

interface ServiceRequestFormProps {
  initialService?: ServiceKey;
  onSuccess?: () => void;
}

const SERVICE_LABEL_MAP: Record<ServiceKey, string> = {
  passport: 'Passport Appointment Assistance',
  application: 'Application & Digital Assistance',
  flight: 'Flight/Ticket Assistance',
};

export default function ServiceRequestForm({
  initialService = 'application',
  onSuccess,
}: ServiceRequestFormProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegramContact, setTelegramContact] = useState('');
  const [email, setEmail] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceKey>(initialService);

  const [passportHelpWith, setPassportHelpWith] = useState('');
  const [passportLocation, setPassportLocation] = useState('');
  const [passportProblem, setPassportProblem] = useState('');

  const [platformName, setPlatformName] = useState('');
  const [tryingToDo, setTryingToDo] = useState('');
  const [digitalProblem, setDigitalProblem] = useState('');
  const [deadline, setDeadline] = useState('');
  const [optionalDescription, setOptionalDescription] = useState('');

  const [departureCity, setDepartureCity] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState<'One-way' | 'Round trip'>('One-way');
  const [passengers, setPassengers] = useState('1');
  const [travelClass, setTravelClass] = useState('Economy');

  const [moreDetails, setMoreDetails] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedSummary, setSubmittedSummary] = useState<{
    fullName: string;
    serviceLabel: string;
    phone: string;
    telegramContact: string;
  } | null>(null);

  useEffect(() => {
    setSelectedService(initialService);
  }, [initialService]);

  const buildStructuredNotes = (): string => {
    const parts: string[] = [];
    if (telegramContact.trim()) parts.push(`Telegram: ${telegramContact.trim()}`);
    if (email.trim()) parts.push(`Email: ${email.trim()}`);

    if (selectedService === 'passport') {
      if (passportHelpWith.trim()) parts.push(`Passport Help Needed: ${passportHelpWith.trim()}`);
      if (passportLocation.trim()) parts.push(`Current Location: ${passportLocation.trim()}`);
      if (passportProblem.trim()) parts.push(`Passport Issue: ${passportProblem.trim()}`);
    } else if (selectedService === 'application') {
      if (platformName.trim()) parts.push(`Platform/Application: ${platformName.trim()}`);
      if (tryingToDo.trim()) parts.push(`Goal: ${tryingToDo.trim()}`);
      if (digitalProblem.trim()) parts.push(`Problem: ${digitalProblem.trim()}`);
      if (deadline.trim()) parts.push(`Deadline: ${deadline.trim()}`);
      if (optionalDescription.trim()) parts.push(`Notes: ${optionalDescription.trim()}`);
    } else if (selectedService === 'flight') {
      if (departureCity.trim()) parts.push(`Departure: ${departureCity.trim()}`);
      if (destination.trim()) parts.push(`Destination: ${destination.trim()}`);
      if (departureDate.trim()) parts.push(`Departure Date: ${departureDate.trim()}`);
      if (tripType === 'Round trip' && returnDate.trim()) {
        parts.push(`Return Date: ${returnDate.trim()}`);
      }
      parts.push(`Trip Type: ${tripType}`);
      parts.push(`Passengers: ${passengers.trim() || '1'}`);
      parts.push(`Class: ${travelClass}`);
    }

    if (moreDetails.trim()) {
      parts.push(`Additional Details: ${moreDetails.trim()}`);
    }

    return parts.join(' | ');
  };

  const validateForm = (): string | null => {
    if (fullName.trim().length < 2) {
      return 'Please enter your full name.';
    }
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 7) {
      return 'Please enter a valid phone number.';
    }
    if (!telegramContact.trim()) {
      return 'Please enter your Telegram username or contact.';
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return 'Please enter a valid email address or leave it blank.';
    }

    if (selectedService === 'passport') {
      if (!passportHelpWith.trim()) return 'Please specify what you need help with for your passport request.';
      if (!passportLocation.trim()) return 'Please enter your current location.';
      if (!passportProblem.trim()) return 'Please describe the passport problem or situation.';
    } else if (selectedService === 'application') {
      if (!platformName.trim()) return 'Please enter the name of the application or platform.';
      if (!tryingToDo.trim()) return 'Please state what you are trying to do.';
      if (!digitalProblem.trim()) return 'Please describe the problem you are experiencing.';
    } else if (selectedService === 'flight') {
      if (!departureCity.trim()) return 'Please enter your departure city or country.';
      if (!destination.trim()) return 'Please enter your destination.';
      if (!departureDate.trim()) return 'Please enter your preferred departure date.';
      if (tripType === 'Round trip' && !returnDate.trim()) {
        return 'Please enter a return date for a round trip or switch to One-way.';
      }
      const paxCount = Number(passengers);
      if (!Number.isFinite(paxCount) || paxCount < 1) {
        return 'Please enter at least 1 passenger.';
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setSubmitting(true);
    const serviceLabel = SERVICE_LABEL_MAP[selectedService];
    const summaryText = buildStructuredNotes();

    const { error } = await supabase.from('bookings').insert([
      {
        full_name: fullName.trim(),
        phone: phone.trim(),
        selected_service: serviceLabel,
        tx_ref: summaryText.slice(0, 480) || 'Pending initial discussion',
      },
    ]);

    setSubmitting(false);

    if (error) {
      setErrorMsg('Could not submit your request right now: ' + error.message);
      return;
    }

    setSubmittedSummary({
      fullName: fullName.trim(),
      serviceLabel,
      phone: phone.trim(),
      telegramContact: telegramContact.trim(),
    });

    setFullName('');
    setPhone('');
    setTelegramContact('');
    setEmail('');
    setPassportHelpWith('');
    setPassportLocation('');
    setPassportProblem('');
    setPlatformName('');
    setTryingToDo('');
    setDigitalProblem('');
    setDeadline('');
    setOptionalDescription('');
    setDepartureCity('');
    setDestination('');
    setDepartureDate('');
    setReturnDate('');
    setTripType('One-way');
    setPassengers('1');
    setTravelClass('Economy');
    setMoreDetails('');

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-4">
      {submittedSummary && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-100 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Service Request Received</span>
          </div>
          <p className="text-xs leading-relaxed text-emerald-100/90">
            Thank you, <span className="font-semibold">{submittedSummary.fullName}</span>. Your request for{' '}
            <span className="font-semibold">{submittedSummary.serviceLabel}</span> has been recorded. We will review
            your details and contact you via phone ({submittedSummary.phone}) or Telegram (
            {submittedSummary.telegramContact}) for our initial discussion before any 200 ETB deposit is requested.
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs text-red-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Full Name <span className="text-blue-400">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Phone Number <span className="text-blue-400">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +251 9XX XXX XXX"
              required
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Telegram Username / Contact <span className="text-blue-400">*</span>
            </label>
            <input
              type="text"
              value={telegramContact}
              onChange={(e) => setTelegramContact(e.target.value)}
              placeholder="@username or Telegram number"
              required
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Select a Service <span className="text-blue-400">*</span>
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value as ServiceKey)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="passport">Passport Appointment Assistance</option>
            <option value="application">Application &amp; Digital Assistance</option>
            <option value="flight">Flight/Ticket Assistance</option>
          </select>
        </div>

        {selectedService === 'passport' && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Passport Assistance Details
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                What do you need help with? <span className="text-blue-400">*</span>
              </label>
              <input
                type="text"
                value={passportHelpWith}
                onChange={(e) => setPassportHelpWith(e.target.value)}
                placeholder="e.g. Booking an appointment, filling online forms, understanding steps"
                required
                className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Current location <span className="text-blue-400">*</span>
              </label>
              <input
                type="text"
                value={passportLocation}
                onChange={(e) => setPassportLocation(e.target.value)}
                placeholder="City or region where you are currently located"
                required
                className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description of the problem <span className="text-blue-400">*</span>
              </label>
              <textarea
                rows={2}
                value={passportProblem}
                onChange={(e) => setPassportProblem(e.target.value)}
                placeholder="Describe what you have tried and where you are stuck"
                required
                className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {selectedService === 'application' && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Application &amp; Digital Assistance Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Name of the application/platform <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  placeholder="University portal, scholarship, online form, etc."
                  required
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deadline, if applicable
                </label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="e.g. December 15, 2026 or None"
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                What are you trying to do? <span className="text-blue-400">*</span>
              </label>
              <input
                type="text"
                value={tryingToDo}
                onChange={(e) => setTryingToDo(e.target.value)}
                placeholder="e.g. Complete an application, upload documents, modify details, submit"
                required
                className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                What problem are you experiencing? <span className="text-blue-400">*</span>
              </label>
              <textarea
                rows={2}
                value={digitalProblem}
                onChange={(e) => setDigitalProblem(e.target.value)}
                placeholder="Share any error messages, upload issues, account hurdles, or unclear steps"
                required
                className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Optional description
              </label>
              <input
                type="text"
                value={optionalDescription}
                onChange={(e) => setOptionalDescription(e.target.value)}
                placeholder="Any extra context that helps us understand your request"
                className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {selectedService === 'flight' && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Flight &amp; Ticket Assistance Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Departure city/country <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  value={departureCity}
                  onChange={(e) => setDepartureCity(e.target.value)}
                  placeholder="e.g. Addis Ababa, Ethiopia"
                  required
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Destination <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Destination city or country"
                  required
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Departure date <span className="text-blue-400">*</span>
                </label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  required
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Return date <span className="text-slate-500 font-normal">(if applicable)</span>
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  disabled={tripType === 'One-way'}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white disabled:opacity-40 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  One-way or round trip
                </label>
                <select
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value as 'One-way' | 'Round trip')}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="One-way">One-way</option>
                  <option value="Round trip">Round trip</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Number of passengers
                </label>
                <input
                  type="number"
                  min={1}
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Preferred travel class
                </label>
                <select
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business</option>
                  <option value="First">First</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Tell us more about what you need:
          </label>
          <textarea
            rows={3}
            value={moreDetails}
            onChange={(e) => setMoreDetails(e.target.value)}
            placeholder="Share any useful context so we can review your request clearly"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>{submitting ? 'Submitting Request...' : 'Submit Request'}</span>
        </button>
      </form>
    </div>
  );
}