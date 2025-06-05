--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (PGlite 0.2.0)
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = off;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET escape_string_warning = off;
SET row_security = off;

--
-- Name: meta; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA meta;


ALTER SCHEMA meta OWNER TO postgres;

--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: embeddings; Type: TABLE; Schema: meta; Owner: postgres
--

CREATE TABLE meta.embeddings (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    content text NOT NULL,
    embedding public.vector(384) NOT NULL
);


ALTER TABLE meta.embeddings OWNER TO postgres;

--
-- Name: embeddings_id_seq; Type: SEQUENCE; Schema: meta; Owner: postgres
--

ALTER TABLE meta.embeddings ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME meta.embeddings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: migrations; Type: TABLE; Schema: meta; Owner: postgres
--

CREATE TABLE meta.migrations (
    version text NOT NULL,
    name text,
    applied_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE meta.migrations OWNER TO postgres;

--
-- Name: ambulancerequests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ambulancerequests (
    id uuid NOT NULL,
    patient_id uuid,
    requested_by uuid,
    paramedic_id uuid,
    request_time timestamp without time zone,
    pickup_location text,
    dropoff_location text,
    status text,
    notes text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    CONSTRAINT ambulancerequests_status_check CHECK ((status = ANY (ARRAY['requested'::text, 'en_route'::text, 'arrived'::text, 'completed'::text, 'cancelled'::text])))
);


ALTER TABLE public.ambulancerequests OWNER TO postgres;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id uuid NOT NULL,
    patient_id uuid,
    doctor_id uuid,
    department_id uuid,
    scheduled_time timestamp without time zone,
    status text,
    visit_reason text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    CONSTRAINT appointments_status_check CHECK ((status = ANY (ARRAY['scheduled'::text, 'checked_in'::text, 'completed'::text, 'cancelled'::text, 'no_show'::text])))
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- Name: beds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.beds (
    id uuid NOT NULL,
    room_id uuid,
    bed_number character varying(10),
    is_occupied boolean DEFAULT false
);


ALTER TABLE public.beds OWNER TO postgres;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id uuid NOT NULL,
    hospital_id uuid,
    name character varying(255),
    type character varying(100),
    floor character varying(50),
    head_user_id uuid,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: doctornotes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctornotes (
    id uuid NOT NULL,
    visit_id uuid,
    doctor_id uuid,
    note text,
    created_at timestamp without time zone
);


ALTER TABLE public.doctornotes OWNER TO postgres;

--
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id uuid NOT NULL,
    patient_id uuid,
    visit_id uuid,
    title character varying(255),
    document_type character varying(100),
    file_url text,
    uploaded_by uuid,
    uploaded_at timestamp without time zone
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- Name: emergencycases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emergencycases (
    id uuid NOT NULL,
    patient_id uuid,
    arrival_mode text,
    triage_level text,
    paramedic_id uuid,
    arrival_time timestamp without time zone,
    initial_diagnosis text,
    treated_by uuid,
    outcome text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    CONSTRAINT emergencycases_arrival_mode_check CHECK ((arrival_mode = ANY (ARRAY['walk-in'::text, 'ambulance'::text]))),
    CONSTRAINT emergencycases_outcome_check CHECK ((outcome = ANY (ARRAY['admitted'::text, 'discharged'::text, 'referred'::text, 'deceased'::text]))),
    CONSTRAINT emergencycases_triage_level_check CHECK ((triage_level = ANY (ARRAY['critical'::text, 'urgent'::text, 'non-urgent'::text])))
);


ALTER TABLE public.emergencycases OWNER TO postgres;

--
-- Name: hospitals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hospitals (
    id uuid NOT NULL,
    name character varying(255),
    type character varying(100),
    address text,
    city character varying(100),
    bed_capacity integer,
    size_category text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    CONSTRAINT hospitals_size_category_check CHECK ((size_category = ANY (ARRAY['small'::text, 'medium'::text, 'large'::text])))
);


ALTER TABLE public.hospitals OWNER TO postgres;

--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id uuid NOT NULL,
    patient_id uuid,
    visit_id uuid,
    total_amount numeric(10,2),
    paid_amount numeric(10,2),
    status text,
    issued_at timestamp without time zone,
    due_date timestamp without time zone,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    CONSTRAINT invoices_status_check CHECK ((status = ANY (ARRAY['unpaid'::text, 'partial'::text, 'paid'::text, 'cancelled'::text])))
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: labresults; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.labresults (
    id uuid NOT NULL,
    patient_id uuid,
    visit_id uuid,
    test_name character varying(255),
    result_value character varying(255),
    unit character varying(50),
    reference_range character varying(100),
    result_date timestamp without time zone,
    notes text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.labresults OWNER TO postgres;

--
-- Name: medicalrecords; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medicalrecords (
    id uuid NOT NULL,
    patient_id uuid,
    doctor_id uuid,
    visit_id uuid,
    diagnosis text,
    treatment_plan text,
    allergies text,
    chronic_conditions text,
    notes text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.medicalrecords OWNER TO postgres;

--
-- Name: medications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medications (
    id uuid NOT NULL,
    name character varying(255),
    description text,
    dosage_form character varying(100),
    strength character varying(100),
    manufacturer character varying(100),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.medications OWNER TO postgres;

--
-- Name: paramedics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paramedics (
    id uuid NOT NULL,
    full_name character varying(255),
    national_id character varying(50),
    phone character varying(30),
    email character varying(100),
    station character varying(100),
    license_number character varying(100),
    certified boolean DEFAULT true,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.paramedics OWNER TO postgres;

--
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    id uuid NOT NULL,
    hospital_id uuid,
    national_id character varying(50),
    full_name character varying(255),
    gender text,
    date_of_birth date,
    phone character varying(30),
    email character varying(100),
    address text,
    emergency_contact_name character varying(255),
    emergency_contact_phone character varying(30),
    insurance_provider character varying(100),
    insurance_number character varying(100),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    CONSTRAINT patients_gender_check CHECK ((gender = ANY (ARRAY['male'::text, 'female'::text, 'other'::text])))
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id uuid NOT NULL,
    name character varying(100)
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: prescriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prescriptions (
    id uuid NOT NULL,
    patient_id uuid,
    doctor_id uuid,
    visit_id uuid,
    medication_id uuid,
    dosage character varying(100),
    frequency character varying(100),
    duration character varying(100),
    notes text,
    prescribed_at timestamp without time zone,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.prescriptions OWNER TO postgres;

--
-- Name: referrals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.referrals (
    id uuid NOT NULL,
    patient_id uuid,
    from_hospital_id uuid,
    to_hospital_id uuid,
    referred_by uuid,
    reason text,
    status text,
    referral_date timestamp without time zone,
    follow_up_required boolean DEFAULT false,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    CONSTRAINT referrals_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, 'completed'::text])))
);


ALTER TABLE public.referrals OWNER TO postgres;

--
-- Name: rolepermissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rolepermissions (
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL
);


ALTER TABLE public.rolepermissions OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid NOT NULL,
    name character varying(100),
    description text
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms (
    id uuid NOT NULL,
    department_id uuid,
    room_number character varying(20),
    type character varying(50),
    floor character varying(50)
);


ALTER TABLE public.rooms OWNER TO postgres;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id uuid NOT NULL,
    invoice_id uuid,
    payment_method character varying(50),
    amount numeric(10,2),
    transaction_date timestamp without time zone,
    reference_number character varying(100),
    created_at timestamp without time zone
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: userroles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.userroles (
    user_id uuid NOT NULL,
    role_id uuid NOT NULL
);


ALTER TABLE public.userroles OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    hospital_id uuid,
    full_name character varying(255),
    email character varying(255),
    role character varying(100),
    department_id uuid,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: visits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.visits (
    id uuid NOT NULL,
    patient_id uuid,
    doctor_id uuid,
    department_id uuid,
    appointment_id uuid,
    visit_type text,
    check_in_time timestamp without time zone,
    check_out_time timestamp without time zone,
    status text,
    reason text,
    notes text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    CONSTRAINT visits_status_check CHECK ((status = ANY (ARRAY['in_progress'::text, 'completed'::text, 'cancelled'::text]))),
    CONSTRAINT visits_visit_type_check CHECK ((visit_type = ANY (ARRAY['outpatient'::text, 'inpatient'::text, 'emergency'::text])))
);


ALTER TABLE public.visits OWNER TO postgres;

--
-- Data for Name: embeddings; Type: TABLE DATA; Schema: meta; Owner: postgres
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: meta; Owner: postgres
--

INSERT INTO meta.migrations VALUES ('202407160001', 'embeddings', '2025-06-02 21:20:48.519+00');


--
-- Data for Name: ambulancerequests; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: beds; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: doctornotes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: emergencycases; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: hospitals; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: labresults; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: medicalrecords; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: medications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: paramedics; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: prescriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: referrals; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: rolepermissions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: userroles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: visits; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: embeddings_id_seq; Type: SEQUENCE SET; Schema: meta; Owner: postgres
--

SELECT pg_catalog.setval('meta.embeddings_id_seq', 1, false);


--
-- Name: embeddings embeddings_pkey; Type: CONSTRAINT; Schema: meta; Owner: postgres
--

ALTER TABLE ONLY meta.embeddings
    ADD CONSTRAINT embeddings_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: meta; Owner: postgres
--

ALTER TABLE ONLY meta.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (version);


--
-- Name: ambulancerequests ambulancerequests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ambulancerequests
    ADD CONSTRAINT ambulancerequests_pkey PRIMARY KEY (id);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: beds beds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beds
    ADD CONSTRAINT beds_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: doctornotes doctornotes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctornotes
    ADD CONSTRAINT doctornotes_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: emergencycases emergencycases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergencycases
    ADD CONSTRAINT emergencycases_pkey PRIMARY KEY (id);


--
-- Name: hospitals hospitals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT hospitals_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: labresults labresults_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.labresults
    ADD CONSTRAINT labresults_pkey PRIMARY KEY (id);


--
-- Name: medicalrecords medicalrecords_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicalrecords
    ADD CONSTRAINT medicalrecords_pkey PRIMARY KEY (id);


--
-- Name: medications medications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medications
    ADD CONSTRAINT medications_pkey PRIMARY KEY (id);


--
-- Name: paramedics paramedics_national_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paramedics
    ADD CONSTRAINT paramedics_national_id_key UNIQUE (national_id);


--
-- Name: paramedics paramedics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paramedics
    ADD CONSTRAINT paramedics_pkey PRIMARY KEY (id);


--
-- Name: patients patients_national_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_national_id_key UNIQUE (national_id);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: prescriptions prescriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_pkey PRIMARY KEY (id);


--
-- Name: referrals referrals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_pkey PRIMARY KEY (id);


--
-- Name: rolepermissions rolepermissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rolepermissions
    ADD CONSTRAINT rolepermissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: userroles userroles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userroles
    ADD CONSTRAINT userroles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: visits visits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_pkey PRIMARY KEY (id);


--
-- Name: ambulancerequests ambulancerequests_paramedic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ambulancerequests
    ADD CONSTRAINT ambulancerequests_paramedic_id_fkey FOREIGN KEY (paramedic_id) REFERENCES public.paramedics(id);


--
-- Name: ambulancerequests ambulancerequests_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ambulancerequests
    ADD CONSTRAINT ambulancerequests_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- Name: ambulancerequests ambulancerequests_requested_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ambulancerequests
    ADD CONSTRAINT ambulancerequests_requested_by_fkey FOREIGN KEY (requested_by) REFERENCES public.users(id);


--
-- Name: appointments appointments_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: appointments appointments_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.users(id);


--
-- Name: appointments appointments_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- Name: beds beds_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beds
    ADD CONSTRAINT beds_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id);


--
-- Name: departments departments_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id);


--
-- Name: doctornotes doctornotes_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctornotes
    ADD CONSTRAINT doctornotes_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.users(id);


--
-- Name: doctornotes doctornotes_visit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctornotes
    ADD CONSTRAINT doctornotes_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES public.visits(id);


--
-- Name: documents documents_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- Name: documents documents_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- Name: documents documents_visit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES public.visits(id);


--
-- Name: emergencycases emergencycases_paramedic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergencycases
    ADD CONSTRAINT emergencycases_paramedic_id_fkey FOREIGN KEY (paramedic_id) REFERENCES public.paramedics(id);


--
-- Name: emergencycases emergencycases_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergencycases
    ADD CONSTRAINT emergencycases_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- Name: emergencycases emergencycases_treated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergencycases
    ADD CONSTRAINT emergencycases_treated_by_fkey FOREIGN KEY (treated_by) REFERENCES public.users(id);


--
-- Name: invoices invoices_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- Name: invoices invoices_visit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES public.visits(id);


--
-- Name: labresults labresults_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.labresults
    ADD CONSTRAINT labresults_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- Name: labresults labresults_visit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.labresults
    ADD CONSTRAINT labresults_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES public.visits(id);


--
-- Name: medicalrecords medicalrecords_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicalrecords
    ADD CONSTRAINT medicalrecords_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.users(id);


--
-- Name: medicalrecords medicalrecords_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicalrecords
    ADD CONSTRAINT medicalrecords_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- Name: medicalrecords medicalrecords_visit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicalrecords
    ADD CONSTRAINT medicalrecords_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES public.visits(id);


--
-- Name: patients patients_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id);


--
-- Name: prescriptions prescriptions_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.users(id);


--
-- Name: prescriptions prescriptions_medication_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_medication_id_fkey FOREIGN KEY (medication_id) REFERENCES public.medications(id);


--
-- Name: prescriptions prescriptions_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- Name: prescriptions prescriptions_visit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES public.visits(id);


--
-- Name: referrals referrals_from_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_from_hospital_id_fkey FOREIGN KEY (from_hospital_id) REFERENCES public.hospitals(id);


--
-- Name: referrals referrals_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- Name: referrals referrals_referred_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_referred_by_fkey FOREIGN KEY (referred_by) REFERENCES public.users(id);


--
-- Name: referrals referrals_to_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_to_hospital_id_fkey FOREIGN KEY (to_hospital_id) REFERENCES public.hospitals(id);


--
-- Name: rolepermissions rolepermissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rolepermissions
    ADD CONSTRAINT rolepermissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id);


--
-- Name: rolepermissions rolepermissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rolepermissions
    ADD CONSTRAINT rolepermissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: rooms rooms_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: transactions transactions_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id);


--
-- Name: userroles userroles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userroles
    ADD CONSTRAINT userroles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: userroles userroles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userroles
    ADD CONSTRAINT userroles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: users users_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: users users_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id);


--
-- Name: visits visits_appointment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id);


--
-- Name: visits visits_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: visits visits_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.users(id);


--
-- Name: visits visits_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- PostgreSQL database dump complete
--

