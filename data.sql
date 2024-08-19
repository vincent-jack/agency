--
-- PostgreSQL database dump
--

-- Dumped from database version 14.12 (Homebrew)
-- Dumped by pg_dump version 14.12 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: company; Type: TABLE; Schema: public; Owner: jackvincent
--

CREATE TABLE public.company (
    id integer NOT NULL,
    companyname character varying(255) NOT NULL,
    town character varying(255) NOT NULL
);


ALTER TABLE public.company OWNER TO jackvincent;

--
-- Name: company_id_seq; Type: SEQUENCE; Schema: public; Owner: jackvincent
--

CREATE SEQUENCE public.company_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.company_id_seq OWNER TO jackvincent;

--
-- Name: company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jackvincent
--

ALTER SEQUENCE public.company_id_seq OWNED BY public.company.id;


--
-- Name: companyperson; Type: TABLE; Schema: public; Owner: jackvincent
--

CREATE TABLE public.companyperson (
    companyid integer NOT NULL,
    personid integer NOT NULL
);


ALTER TABLE public.companyperson OWNER TO jackvincent;

--
-- Name: person; Type: TABLE; Schema: public; Owner: jackvincent
--

CREATE TABLE public.person (
    id integer NOT NULL,
    firstname character varying(255) NOT NULL,
    surname character varying(255) NOT NULL
);


ALTER TABLE public.person OWNER TO jackvincent;

--
-- Name: person_id_seq; Type: SEQUENCE; Schema: public; Owner: jackvincent
--

CREATE SEQUENCE public.person_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.person_id_seq OWNER TO jackvincent;

--
-- Name: person_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jackvincent
--

ALTER SEQUENCE public.person_id_seq OWNED BY public.person.id;


--
-- Name: company id; Type: DEFAULT; Schema: public; Owner: jackvincent
--

ALTER TABLE ONLY public.company ALTER COLUMN id SET DEFAULT nextval('public.company_id_seq'::regclass);


--
-- Name: person id; Type: DEFAULT; Schema: public; Owner: jackvincent
--

ALTER TABLE ONLY public.person ALTER COLUMN id SET DEFAULT nextval('public.person_id_seq'::regclass);


--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: jackvincent
--

COPY public.company (id, companyname, town) FROM stdin;
5	Bargain Booze	Holywell
4	B&M Bargains	Flint
2	Nice-pak	Flint
6	Asda	Flint
7	Screwfix	Flint
9	Food Warehouse	Manchester
\.


--
-- Data for Name: companyperson; Type: TABLE DATA; Schema: public; Owner: jackvincent
--

COPY public.companyperson (companyid, personid) FROM stdin;
5	2
4	2
7	2
6	2
5	8
4	7
5	7
7	7
5	6
4	6
5	5
4	5
2	5
6	6
6	5
\.


--
-- Data for Name: person; Type: TABLE DATA; Schema: public; Owner: jackvincent
--

COPY public.person (id, firstname, surname) FROM stdin;
6	Tom	Williams
5	Christine	Powell
2	Thomas	Jones
8	Zac	Jones
7	Chris	Brown
\.


--
-- Name: company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jackvincent
--

SELECT pg_catalog.setval('public.company_id_seq', 9, true);


--
-- Name: person_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jackvincent
--

SELECT pg_catalog.setval('public.person_id_seq', 8, true);


--
-- Name: company company_pkey; Type: CONSTRAINT; Schema: public; Owner: jackvincent
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (id);


--
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: jackvincent
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

