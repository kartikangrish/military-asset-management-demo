--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

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
-- Name: ApiLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ApiLog" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    action text NOT NULL,
    entity text NOT NULL,
    "entityId" integer,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    details text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ApiLog" OWNER TO postgres;

--
-- Name: ApiLog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ApiLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ApiLog_id_seq" OWNER TO postgres;

--
-- Name: ApiLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ApiLog_id_seq" OWNED BY public."ApiLog".id;


--
-- Name: Asset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Asset" (
    id integer NOT NULL,
    type text NOT NULL,
    serial text NOT NULL,
    description text,
    "baseId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Asset" OWNER TO postgres;

--
-- Name: Asset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Asset_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Asset_id_seq" OWNER TO postgres;

--
-- Name: Asset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Asset_id_seq" OWNED BY public."Asset".id;


--
-- Name: Assignment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Assignment" (
    id integer NOT NULL,
    "assetId" integer NOT NULL,
    "baseId" integer NOT NULL,
    "personnelId" integer NOT NULL,
    quantity integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "assignedById" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Assignment" OWNER TO postgres;

--
-- Name: Assignment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Assignment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Assignment_id_seq" OWNER TO postgres;

--
-- Name: Assignment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Assignment_id_seq" OWNED BY public."Assignment".id;


--
-- Name: Base; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Base" (
    id integer NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Base" OWNER TO postgres;

--
-- Name: Base_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Base_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Base_id_seq" OWNER TO postgres;

--
-- Name: Base_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Base_id_seq" OWNED BY public."Base".id;


--
-- Name: Expenditure; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Expenditure" (
    id integer NOT NULL,
    "assetId" integer NOT NULL,
    "baseId" integer NOT NULL,
    "personnelId" integer NOT NULL,
    quantity integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expendedById" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Expenditure" OWNER TO postgres;

--
-- Name: Expenditure_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Expenditure_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Expenditure_id_seq" OWNER TO postgres;

--
-- Name: Expenditure_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Expenditure_id_seq" OWNED BY public."Expenditure".id;


--
-- Name: Purchase; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Purchase" (
    id integer NOT NULL,
    "assetId" integer NOT NULL,
    "baseId" integer NOT NULL,
    quantity integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdById" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Purchase" OWNER TO postgres;

--
-- Name: Purchase_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Purchase_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Purchase_id_seq" OWNER TO postgres;

--
-- Name: Purchase_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Purchase_id_seq" OWNED BY public."Purchase".id;


--
-- Name: Role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Role" (
    id integer NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Role" OWNER TO postgres;

--
-- Name: Role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Role_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Role_id_seq" OWNER TO postgres;

--
-- Name: Role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Role_id_seq" OWNED BY public."Role".id;


--
-- Name: Transfer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Transfer" (
    id integer NOT NULL,
    "assetId" integer NOT NULL,
    "fromBaseId" integer NOT NULL,
    "toBaseId" integer NOT NULL,
    quantity integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdById" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Transfer" OWNER TO postgres;

--
-- Name: Transfer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Transfer_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Transfer_id_seq" OWNER TO postgres;

--
-- Name: Transfer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Transfer_id_seq" OWNED BY public."Transfer".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    password text NOT NULL,
    "roleId" integer NOT NULL,
    "baseId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: ApiLog id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ApiLog" ALTER COLUMN id SET DEFAULT nextval('public."ApiLog_id_seq"'::regclass);


--
-- Name: Asset id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Asset" ALTER COLUMN id SET DEFAULT nextval('public."Asset_id_seq"'::regclass);


--
-- Name: Assignment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assignment" ALTER COLUMN id SET DEFAULT nextval('public."Assignment_id_seq"'::regclass);


--
-- Name: Base id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Base" ALTER COLUMN id SET DEFAULT nextval('public."Base_id_seq"'::regclass);


--
-- Name: Expenditure id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expenditure" ALTER COLUMN id SET DEFAULT nextval('public."Expenditure_id_seq"'::regclass);


--
-- Name: Purchase id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase" ALTER COLUMN id SET DEFAULT nextval('public."Purchase_id_seq"'::regclass);


--
-- Name: Role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role" ALTER COLUMN id SET DEFAULT nextval('public."Role_id_seq"'::regclass);


--
-- Name: Transfer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transfer" ALTER COLUMN id SET DEFAULT nextval('public."Transfer_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: ApiLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ApiLog" (id, "userId", action, entity, "entityId", "timestamp", details, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Asset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Asset" (id, type, serial, description, "baseId", "createdAt", "updatedAt") FROM stdin;
1	Vehicle	ASSET-1	Test Asset 1	1	2025-06-18 10:34:07.725	2025-06-18 10:34:07.725
2	Weapon	ASSET-2	Test Asset 2	1	2025-06-18 10:34:07.727	2025-06-18 10:34:07.727
3	Ammunition	ASSET-3	Test Asset 3	1	2025-06-18 10:34:07.728	2025-06-18 10:34:07.728
4	Equipment	ASSET-4	Test Asset 4	1	2025-06-18 10:34:07.729	2025-06-18 10:34:07.729
5	Vehicle	ASSET-5	Test Asset 5	1	2025-06-18 10:34:07.731	2025-06-18 10:34:07.731
6	Weapon	ASSET-6	Test Asset 6	1	2025-06-18 10:34:07.732	2025-06-18 10:34:07.732
7	Ammunition	ASSET-7	Test Asset 7	1	2025-06-18 10:34:07.733	2025-06-18 10:34:07.733
8	Equipment	ASSET-8	Test Asset 8	1	2025-06-18 10:34:07.734	2025-06-18 10:34:07.734
9	Vehicle	ASSET-9	Test Asset 9	1	2025-06-18 10:34:07.735	2025-06-18 10:34:07.735
10	Weapon	ASSET-10	Test Asset 10	1	2025-06-18 10:34:07.735	2025-06-18 10:34:07.735
\.


--
-- Data for Name: Assignment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Assignment" (id, "assetId", "baseId", "personnelId", quantity, date, "assignedById", "createdAt", "updatedAt") FROM stdin;
1	2	1	1	2	2025-06-09 18:30:00	1	2025-06-18 10:34:07.747	2025-06-18 10:34:07.747
\.


--
-- Data for Name: Base; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Base" (id, name, location, "createdAt", "updatedAt") FROM stdin;
1	HQ	Central Command	2025-06-18 10:34:07.624	2025-06-19 03:14:30.951
2	Northern Base	Northern Region	2025-06-18 10:34:07.627	2025-06-19 03:14:30.953
3	Southern Base	Southern Region	2025-06-18 10:34:07.629	2025-06-19 03:14:30.955
4	Eastern Base	Eastern Region	2025-06-18 10:34:07.63	2025-06-19 03:14:30.956
5	Western Base	Western Region	2025-06-18 10:34:07.632	2025-06-19 03:14:30.957
\.


--
-- Data for Name: Expenditure; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Expenditure" (id, "assetId", "baseId", "personnelId", quantity, date, "expendedById", "createdAt", "updatedAt") FROM stdin;
1	3	1	1	1	2025-06-14 18:30:00	1	2025-06-18 10:34:07.749	2025-06-18 10:34:07.749
\.


--
-- Data for Name: Purchase; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Purchase" (id, "assetId", "baseId", quantity, date, "createdById", "createdAt", "updatedAt") FROM stdin;
1	1	1	10	2025-05-31 18:30:00	1	2025-06-18 10:34:07.737	2025-06-18 10:34:07.737
2	2	1	10	2025-05-31 18:30:00	1	2025-06-18 10:34:07.739	2025-06-18 10:34:07.739
3	3	1	10	2025-05-31 18:30:00	1	2025-06-18 10:34:07.741	2025-06-18 10:34:07.741
4	4	1	10	2025-05-31 18:30:00	1	2025-06-18 10:34:07.742	2025-06-18 10:34:07.742
5	5	1	10	2025-05-31 18:30:00	1	2025-06-18 10:34:07.743	2025-06-18 10:34:07.743
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Role" (id, name, "createdAt", "updatedAt") FROM stdin;
1	Admin	2025-06-18 10:34:07.596	2025-06-18 10:34:07.596
2	Base Commander	2025-06-18 10:34:07.603	2025-06-18 10:34:07.603
3	Logistics Officer	2025-06-18 10:34:07.605	2025-06-18 10:34:07.605
\.


--
-- Data for Name: Transfer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Transfer" (id, "assetId", "fromBaseId", "toBaseId", quantity, date, "createdById", "createdAt", "updatedAt") FROM stdin;
1	1	1	2	3	2025-06-04 18:30:00	1	2025-06-18 10:34:07.744	2025-06-18 10:34:07.744
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, name, password, "roleId", "baseId", "createdAt", "updatedAt") FROM stdin;
1	admin@military.local	Admin User	$2a$10$geZDMc5AFKsFUNJKK3pXge9L2QN3WRScBigJ7MtRXamv9MJihWM8y	1	1	2025-06-18 10:34:07.71	2025-06-18 10:34:07.71
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
f4337441-aa3e-4f4b-93fd-46626763e2db	37f286b030d46eedd33a379dea76114ff0357199e3e9177286f8d94982498e9b	2025-06-18 16:04:05.291791+05:30	20250618091738_init	\N	\N	2025-06-18 16:04:05.194635+05:30	1
\.


--
-- Name: ApiLog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ApiLog_id_seq"', 1, false);


--
-- Name: Asset_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Asset_id_seq"', 11, true);


--
-- Name: Assignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Assignment_id_seq"', 1, true);


--
-- Name: Base_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Base_id_seq"', 10, true);


--
-- Name: Expenditure_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Expenditure_id_seq"', 1, true);


--
-- Name: Purchase_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Purchase_id_seq"', 5, true);


--
-- Name: Role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Role_id_seq"', 3, true);


--
-- Name: Transfer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Transfer_id_seq"', 1, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- Name: ApiLog ApiLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ApiLog"
    ADD CONSTRAINT "ApiLog_pkey" PRIMARY KEY (id);


--
-- Name: Asset Asset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Asset"
    ADD CONSTRAINT "Asset_pkey" PRIMARY KEY (id);


--
-- Name: Assignment Assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_pkey" PRIMARY KEY (id);


--
-- Name: Base Base_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Base"
    ADD CONSTRAINT "Base_pkey" PRIMARY KEY (id);


--
-- Name: Expenditure Expenditure_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expenditure"
    ADD CONSTRAINT "Expenditure_pkey" PRIMARY KEY (id);


--
-- Name: Purchase Purchase_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_pkey" PRIMARY KEY (id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: Transfer Transfer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transfer"
    ADD CONSTRAINT "Transfer_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Asset_serial_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Asset_serial_key" ON public."Asset" USING btree (serial);


--
-- Name: Base_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Base_name_key" ON public."Base" USING btree (name);


--
-- Name: Role_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Role_name_key" ON public."Role" USING btree (name);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: ApiLog ApiLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ApiLog"
    ADD CONSTRAINT "ApiLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Asset Asset_baseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Asset"
    ADD CONSTRAINT "Asset_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES public."Base"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Assignment Assignment_assetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES public."Asset"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Assignment Assignment_assignedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Assignment Assignment_baseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES public."Base"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Assignment Assignment_personnelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Expenditure Expenditure_assetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expenditure"
    ADD CONSTRAINT "Expenditure_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES public."Asset"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Expenditure Expenditure_baseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expenditure"
    ADD CONSTRAINT "Expenditure_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES public."Base"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Expenditure Expenditure_expendedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expenditure"
    ADD CONSTRAINT "Expenditure_expendedById_fkey" FOREIGN KEY ("expendedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Expenditure Expenditure_personnelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expenditure"
    ADD CONSTRAINT "Expenditure_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Purchase Purchase_assetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES public."Asset"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Purchase Purchase_baseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES public."Base"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Purchase Purchase_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transfer Transfer_assetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transfer"
    ADD CONSTRAINT "Transfer_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES public."Asset"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transfer Transfer_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transfer"
    ADD CONSTRAINT "Transfer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transfer Transfer_fromBaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transfer"
    ADD CONSTRAINT "Transfer_fromBaseId_fkey" FOREIGN KEY ("fromBaseId") REFERENCES public."Base"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transfer Transfer_toBaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transfer"
    ADD CONSTRAINT "Transfer_toBaseId_fkey" FOREIGN KEY ("toBaseId") REFERENCES public."Base"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_baseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES public."Base"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

