--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4 (Homebrew)

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: default
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO "default";

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: default
--

COMMENT ON SCHEMA public IS '';


--
-- Name: addresses_status; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public.addresses_status AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public.addresses_status OWNER TO "default";

--
-- Name: catering_requests_need_host; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public.catering_requests_need_host AS ENUM (
    'yes',
    'no'
);


ALTER TYPE public.catering_requests_need_host OWNER TO "default";

--
-- Name: catering_requests_status; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public.catering_requests_status AS ENUM (
    'active',
    'assigned',
    'cancelled',
    'completed'
);


ALTER TYPE public.catering_requests_status OWNER TO "default";

--
-- Name: dispatches_service_type; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public.dispatches_service_type AS ENUM (
    'catering',
    'ondemand'
);


ALTER TYPE public.dispatches_service_type OWNER TO "default";

--
-- Name: dispatches_user_type; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public.dispatches_user_type AS ENUM (
    'vendor',
    'client'
);


ALTER TYPE public.dispatches_user_type OWNER TO "default";

--
-- Name: driver_status; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public.driver_status AS ENUM (
    'arrived_at_vendor',
    'en_route_to_client',
    'arrived_to_client',
    'assigned',
    'completed'
);


ALTER TYPE public.driver_status OWNER TO "default";

--
-- Name: on_demand_status; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public.on_demand_status AS ENUM (
    'active',
    'assigned',
    'cancelled',
    'completed'
);


ALTER TYPE public.on_demand_status OWNER TO "default";

--
-- Name: on_demand_vehicle_type; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public.on_demand_vehicle_type AS ENUM (
    'Car',
    'Van',
    'Truck'
);


ALTER TYPE public.on_demand_vehicle_type OWNER TO "default";

--
-- Name: users_status; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public.users_status AS ENUM (
    'active',
    'pending',
    'deleted'
);


ALTER TYPE public.users_status OWNER TO "default";

--
-- Name: users_type; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public.users_type AS ENUM (
    'vendor',
    'client',
    'driver',
    'admin',
    'helpdesk'
);


ALTER TYPE public.users_type OWNER TO "default";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: default
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


ALTER TABLE public._prisma_migrations OWNER TO "default";

--
-- Name: account; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.account (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public.account OWNER TO "default";

--
-- Name: address; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.address (
    id bigint NOT NULL,
    user_id text NOT NULL,
    county character varying(191),
    vendor text,
    street1 character varying(191),
    street2 character varying(191),
    city character varying(191),
    state character varying(191),
    zip character varying(191),
    location_number character varying(191),
    parking_loading character varying(191),
    status public.addresses_status DEFAULT 'inactive'::public.addresses_status NOT NULL,
    created_at timestamp(6) with time zone,
    updated_at timestamp(6) with time zone
);


ALTER TABLE public.address OWNER TO "default";

--
-- Name: address_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.address_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.address_id_seq OWNER TO "default";

--
-- Name: address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.address_id_seq OWNED BY public.address.id;


--
-- Name: catering_request; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.catering_request (
    id bigint NOT NULL,
    guid text,
    user_id text NOT NULL,
    address_id bigint NOT NULL,
    brokerage character varying(191),
    order_number text NOT NULL,
    date date,
    pickup_time time(6) without time zone,
    arrival_time time(6) without time zone,
    complete_time time(6) without time zone,
    headcount character varying(191),
    need_host public.catering_requests_need_host DEFAULT 'no'::public.catering_requests_need_host NOT NULL,
    hours_needed character varying(191),
    number_of_host character varying(191),
    client_attention text,
    pickup_notes text,
    special_notes text,
    image text,
    status public.catering_requests_status DEFAULT 'active'::public.catering_requests_status,
    order_total numeric(10,2) DEFAULT 0.00,
    tip numeric(10,2) DEFAULT 0.00,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    delivery_address_id bigint NOT NULL,
    driver_status public.driver_status
);


ALTER TABLE public.catering_request OWNER TO "default";

--
-- Name: catering_request_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.catering_request_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catering_request_id_seq OWNER TO "default";

--
-- Name: catering_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.catering_request_id_seq OWNED BY public.catering_request.id;


--
-- Name: dispatch; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.dispatch (
    id text NOT NULL,
    "cateringRequestId" bigint,
    "createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "driverId" text,
    "on_demandId" bigint,
    "updatedAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text
);


ALTER TABLE public.dispatch OWNER TO "default";

--
-- Name: failed_job; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.failed_job (
    id bigint NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.failed_job OWNER TO "default";

--
-- Name: failed_job_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.failed_job_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.failed_job_id_seq OWNER TO "default";

--
-- Name: failed_job_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.failed_job_id_seq OWNED BY public.failed_job.id;


--
-- Name: file_upload; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.file_upload (
    id text NOT NULL,
    "userId" text NOT NULL,
    "fileName" text NOT NULL,
    "fileType" text NOT NULL,
    "fileSize" integer NOT NULL,
    "fileUrl" text NOT NULL,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.file_upload OWNER TO "default";

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.migrations (
    id bigint NOT NULL,
    migration character varying(191) NOT NULL,
    batch bigint NOT NULL
);


ALTER TABLE public.migrations OWNER TO "default";

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO "default";

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: on_demand; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.on_demand (
    id bigint NOT NULL,
    guid text,
    user_id text NOT NULL,
    address_id bigint NOT NULL,
    order_number character varying(191) NOT NULL,
    date date NOT NULL,
    pickup_time time(6) without time zone NOT NULL,
    arrival_time time(6) without time zone NOT NULL,
    complete_time time(6) without time zone,
    hours_needed character varying(191),
    item_delivered character varying(191),
    vehicle_type public.on_demand_vehicle_type DEFAULT 'Car'::public.on_demand_vehicle_type NOT NULL,
    client_attention text NOT NULL,
    pickup_notes text,
    special_notes text,
    image text,
    status public.on_demand_status DEFAULT 'active'::public.on_demand_status NOT NULL,
    order_total numeric(10,2) DEFAULT 0.00,
    tip numeric(10,2) DEFAULT 0.00,
    length character varying(191),
    width character varying(191),
    height character varying(191),
    weight character varying(191),
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    delivery_address_id bigint NOT NULL,
    driver_status public.driver_status
);


ALTER TABLE public.on_demand OWNER TO "default";

--
-- Name: on_demand_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.on_demand_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.on_demand_id_seq OWNER TO "default";

--
-- Name: on_demand_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.on_demand_id_seq OWNED BY public.on_demand.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.session (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO "default";

--
-- Name: user; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."user" (
    id text NOT NULL,
    guid text,
    name text,
    email text,
    "emailVerified" timestamp(3) without time zone,
    image text,
    password text,
    "passwordResetToken" text,
    "passwordResetTokenExp" timestamp(3) without time zone,
    type public.users_type DEFAULT 'vendor'::public.users_type NOT NULL,
    company_name character varying(191),
    contact_name character varying(191),
    contact_number character varying(191),
    website character varying(191),
    street1 character varying(191),
    street2 character varying(191),
    city character varying(191),
    state character varying(191),
    zip character varying(191),
    location_number character varying(191),
    parking_loading character varying(191),
    counties text,
    time_needed text,
    catering_brokerage text,
    frequency text,
    provide text,
    head_count character varying(191),
    photo_vehicle text,
    photo_license text,
    photo_insurance text,
    status public.users_status DEFAULT 'pending'::public.users_status NOT NULL,
    side_notes text,
    confirmation_code text,
    remember_token character varying(100),
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."user" OWNER TO "default";

--
-- Name: verification_token; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.verification_token (
    id text NOT NULL,
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.verification_token OWNER TO "default";

--
-- Name: address id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.address ALTER COLUMN id SET DEFAULT nextval('public.address_id_seq'::regclass);


--
-- Name: catering_request id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.catering_request ALTER COLUMN id SET DEFAULT nextval('public.catering_request_id_seq'::regclass);


--
-- Name: failed_job id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.failed_job ALTER COLUMN id SET DEFAULT nextval('public.failed_job_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: on_demand id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.on_demand ALTER COLUMN id SET DEFAULT nextval('public.on_demand_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
f2bae690-7a65-4d3f-98e0-9ec267cc5221	455013357423b94b850ac9a849fdb1ec227b200ee94e95036286d318f35a77b8	2024-09-11 22:54:46.003938+00	20240911225445_init	\N	\N	2024-09-11 22:54:45.574258+00	1
445016d3-d38a-4ca0-bbed-c1c5262f8712	67c5549eec92a1269f138b5fee5a3c90ebcfed2bb732ab8fa16aac4a6f8fe9aa	2024-09-11 23:21:14.921776+00	20240911232114_update_driver_status_enum	\N	\N	2024-09-11 23:21:14.534099+00	1
7ff58e25-01e7-43fe-9dac-ac1f8a19774c	c38371b286a0135331b886f77edcc85fe08a2309e9915812ccd3b432190c4cb5	2024-09-11 23:36:14.473424+00	20240911233613_add_file_upload_model	\N	\N	2024-09-11 23:36:14.040919+00	1
\.


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.account (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.address (id, user_id, county, vendor, street1, street2, city, state, zip, location_number, parking_loading, status, created_at, updated_at) FROM stdin;
1	cm0ygmbwh0000fdlrjuzu2ifq	Main Address	\N	Circuito Villa Gerona	145A	León	Guanajuato	37358	\N	\N	active	2024-09-11 22:56:16.253+00	2024-09-11 22:56:16.253+00
8	cm0ygzg4i00045jkngyawab4h	Douglas County	\N	74228 O'Hara Mount	\N	Fort Haileyfield	Utah	87409-2374	\N	\N	inactive	\N	\N
9	cm0ygzg4h00035jknskeeaz43	Polk County	\N	4232 Martin Luther King Jr Boulevard	\N	Nolantown	South Carolina	65842	\N	\N	active	\N	\N
6	cm0ygzg4900015jkn2t9kfb9e	Wiltshire	\N	4967 Dagmar Trail	\N	East Gerda	Ohio	20416	\N	\N	inactive	\N	\N
3	cm0ygzg4r00085jkni9natbcv	Lothian	\N	13078 Goodwin Cliffs	\N	Colemanstead	Oregon	58956	\N	\N	active	\N	\N
4	cm0ygzg4p00065jkni2m4fzhu	Merseyside	\N	7210 Goodwin Vista	\N	North Melyssa	New Mexico	09414	\N	\N	active	\N	\N
5	cm0ygzg4f00025jkn2l4yd9cs	County Tyrone	\N	6086 Schmeler Dale	\N	North Bridgettetown	California	46652-9366	\N	\N	inactive	\N	\N
7	cm0ygzg4q00075jkntte0eslj	Lee County	\N	673 Wiza Courts	\N	Port Chyna	New Hampshire	58390	\N	\N	inactive	\N	\N
2	cm0ygzg4n00055jknc7zx0mgs	West Sussex	\N	642 Queen's Road	\N	North Ibrahim	Oregon	11364-9746	\N	\N	active	\N	\N
10	cm0ygzg4s00095jknhpb8037g	Cambridgeshire	\N	82738 Reanna Key	\N	North George	Massachusetts	94226	\N	\N	inactive	\N	\N
11	cm0ygzfo800005jkn1wsvk7gz	Cumbria	\N	1503 Ava Burgs	\N	Fort Julius	Alabama	60746-5377	\N	\N	inactive	\N	\N
12	cm0yh0hjk00099t9bhmsau1z8	Derbyshire	\N	471 Swift Oval	\N	South Kasey	West Virginia	33567	\N	\N	inactive	\N	\N
13	cm0yh0hht00019t9b1ysdzyt9	Oxfordshire	\N	31682 Lockman Rapid	\N	East Sammyborough	Washington	69233	\N	\N	active	\N	\N
14	cm0yh0hjk00089t9bqjhkf7qw	Johnson County	\N	3993 Nightingale Close	\N	South Gate	Hawaii	58875-4280	\N	\N	inactive	\N	\N
15	cm0yh0hif00039t9bpcq72xuh	Cheshire	\N	91561 7th Street	\N	Maximoburgh	California	91362-1852	\N	\N	inactive	\N	\N
16	cm0yh0hi400029t9b6cui8oio	Marion County	\N	6108 E Jackson Street	\N	Fort Eliezertown	Nevada	18205-0657	\N	\N	inactive	\N	\N
17	cm0yh0hiz00059t9bgfch29sc	Borders	\N	384 2nd Street	\N	South Jean	Idaho	34299	\N	\N	inactive	\N	\N
18	cm0yh0hiq00049t9bg9onlo3a	Montgomery County	\N	9929 E High Street	\N	Port Claudia	Iowa	15310	\N	\N	active	\N	\N
19	cm0yh0hj800069t9b2tdium2t	Lake County	\N	75550 Kohler Valleys	\N	Jeannefield	North Dakota	77585	\N	\N	active	\N	\N
20	cm0yh0hjj00079t9bz6ol67xo	Avon	\N	87974 Nathaniel Pass	\N	West Erin	Virginia	16391-4623	\N	\N	active	\N	\N
21	cm0yh0h2f00009t9b7c642aqj	Union County	\N	8967 St Andrews Close	\N	Torpport	Missouri	75748-1435	\N	\N	active	\N	\N
23	cm0yhd72o00012p1c9yvumwal	San Mateo	Coupa Cafe - Redwood City	123 Main St	\N	Redwood City 	CA	94102	4151232323		inactive	\N	\N
22	cm0yhd72o00012p1c9yvumwal	Main Address	\N	2559 North First Street	\N	San Jose	CA	95131	\N		active	2024-09-11 23:17:09.719+00	2024-09-11 23:17:09.719+00
24	cm0yjbcd60000edcljfu9uzq2	Main Address	Sprouts Farmers Market	370 Gellert Blvd		Daly City	California	95010	\N		active	2024-09-12 00:11:42.453+00	2024-09-12 00:11:42.453+00
25	cm0yjs2po0001edclp5i68794	Main Address	\N	405 Lopez Mateos Ote		Milpitas	California	96210	\N	\N	active	2024-09-12 00:24:43.048+00	2024-09-12 00:24:43.048+00
26	cm0yk8gkz0000r7kkoqf4zd3o	Main Address	\N	5 Santa Ana Av		Daly City	California	95010	\N	\N	active	2024-09-12 00:37:27.524+00	2024-09-12 00:37:27.524+00
27	cm0yl0py8000035o3mg56cgde	Main Address	Las gorditas de ecatepunk	2000 Alameda de las pulgas 		San Mateo	California	94085	\N		active	2024-09-12 00:59:26.041+00	2024-09-12 00:59:26.041+00
28	cm0ylmxor0000394hpr6m7gc8	Main Address	Victoria Secret Burgers	210 Mamacita St		San Mateo	California	95010	\N		active	2024-09-12 01:16:42.501+00	2024-09-12 01:16:42.501+00
30	cm0ymcq1x000055ljqg88b3qk	Main Address	\N	12 Sea St		Burlingame	California	93120	\N	\N	active	2024-09-12 01:36:45.664+00	2024-09-12 01:36:45.664+00
31	cm0ymk8lf000155ljmwu6pe97	Main Address	\N	55 Junipero St		Pacifica	California	94040	\N	\N	active	2024-09-12 01:42:36.279+00	2024-09-12 01:42:36.279+00
32	cm0yxfjr70000ghw35oflurq3	Main Address	Dos Vatos Menuderia	303 Spring Gardens		San Francisco	California	92340	\N		active	2024-09-12 06:46:53.246+00	2024-09-12 06:46:53.246+00
29	cm0ylxv5q0001394h8csnjnx0	San Francisco	Kale Me Crazy	8300 North FM 620	\N	San Francisco	California	95060	4109291595		active	2024-09-12 01:25:12.433+00	2024-09-12 01:25:12.433+00
38	cm0zx6wwu00006gsigu1t5qmn	Alameda	Mamacita Pizzeria	305 Lopez Mateos St	\N	San Bernardino	California	93330	4777645893		inactive	\N	\N
37	cm0zx6wwu00006gsigu1t5qmn	Main Address	\N	99 Miami Av	\N	Miami	Florida	55023	\N		active	2024-09-12 23:27:56.562+00	2024-09-12 23:27:56.562+00
40	cm0zx6wwu00006gsigu1t5qmn	Santa Clara	Kale Me Crazy	55 Junipero St	\N	Pacifica	California	94040	4792608514		inactive	\N	\N
35	cm0ylxv5q0001394h8csnjnx0	San Mateo	Mamacita Pizzeria	21 Beach Av	\N	Santa Clara	California	98010	4202301545		inactive	\N	\N
36	cm0zux95f0001336jz8cflu9l	Main Address	\N	811 Malaguena St		Santa Cruz	California	95060	\N	\N	active	2024-09-12 22:24:26.626+00	2024-09-12 22:24:26.626+00
39	cm0zx6wwu00006gsigu1t5qmn	Napa	Tacos El Guero 	21 Beach Av	\N	Santa Clara	California	98010	4202301545		inactive	\N	\N
33	cm0ylxv5q0001394h8csnjnx0	Alameda	Tacos El Guero 	303 Spring Gardens	\N	San Francisco	California	92340	4103452030		inactive	\N	\N
34	cm0ylxv5q0001394h8csnjnx0	San Francisco	Copia Express	305 Lopez Mateos St	\N	San Mateo	California	93330	4777645893		inactive	\N	\N
\.


--
-- Data for Name: catering_request; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.catering_request (id, guid, user_id, address_id, brokerage, order_number, date, pickup_time, arrival_time, complete_time, headcount, need_host, hours_needed, number_of_host, client_attention, pickup_notes, special_notes, image, status, order_total, tip, created_at, updated_at, delivery_address_id, driver_status) FROM stdin;
1	\N	cm0ygzg4q00075jkntte0eslj	5	\N	UyDTZpP9p2	2024-11-03	23:09:59.126	13:08:59.594	\N	66	yes	4	\N	Tres vesco somniculosus bellicus strenuus.	Calcar sordeo decet doloribus turpis delicate thorax degusto creber. Quae compello coaegresco nisi crepusculum ambulo sono arcesso vulnero. Sto charisma alius truculenter audentia substantia.	Inventore carbo cernuus abundans virga cruciamentum virtus venia. Villa iure talus. Aro reprehenderit ullus accedo tempus articulus.	\N	cancelled	675.52	64.17	2024-09-11 23:06:28.747+00	2024-09-11 23:06:28.747+00	5	\N
4	\N	cm0ygzg4q00075jkntte0eslj	9	\N	Qb3ietpdPV	2024-12-30	17:03:51.42	09:43:07.154	\N	42	yes	7	\N	Ut subseco socius.	Dolorum aeternus veritatis beneficium similique vado avaritia spes causa stultus. Aveho venustas crur. Cattus argentum texo conitor colligo fuga aurum.	Varietas crastinus commodo vis arca cilicium. Auxilium cubicularis tametsi cogo delectatio venia viduo torqueo. Sperno distinctio tondeo suggero aestus fuga derideo.	\N	assigned	231.03	18.45	2024-09-11 23:06:28.747+00	2024-09-11 23:06:28.747+00	9	\N
15	\N	cm0ygzg4r00085jkni9natbcv	4	\N	0jmf2smONz	2025-07-13	02:57:11.282	21:39:55.028	\N	19	yes	8	\N	Blanditiis tutis atrocitas benevolentia.	Odit ager considero sollers. Averto stella tamisium reiciendis blandior adfero urbs arcesso. Advenio trans ventito tabula coadunatio vitium.	Decerno viscus utique. Clarus ventosus aduro auctor. Demoror ubi clamo acceptus.	\N	assigned	765.28	84.07	2024-09-11 23:06:28.747+00	2024-09-11 23:06:28.747+00	4	\N
20	\N	cm0ygzg4n00055jknc7zx0mgs	10	\N	FuHe4uNthI	2025-06-02	02:11:22.931	16:06:30.452	\N	52	no	5	\N	Contigo deprecator eligendi vigilo ut suasoria arcus spectaculum.	Supplanto corrigo adulatio amicitia. Turbo demitto suppono culpa adhuc accusator. Conor amita valde caveo.	Deorsum neque sequi stabilis angustus truculenter callide. Ad suscipio adsidue vacuus vel toties triduana surculus sunt aiunt. Caries caries asporto uredo.	\N	assigned	732.98	50.11	2024-09-11 23:06:28.747+00	2024-09-11 23:06:28.747+00	10	\N
23	\N	cm0yh0hif00039t9bpcq72xuh	14	\N	wQeTEtlGnp	2025-02-18	13:17:59.909	17:48:23.279	\N	15	yes	6	\N	Desparatus suadeo corrumpo.	Xiphias temperantia colo beneficium. Tollo cauda communis sequi defungo acquiro. Auxilium appello acceptus sapiente apparatus contigo sperno varius claro.	Aut apto sursum ustilo audacia blanditiis thesis defleo iusto vulnus. Deprecator tero blandior defessus caelum tardus occaecati desidero amicitia timor. Quisquam baiulus congregatio.	\N	completed	910.48	62.87	2024-09-11 23:07:17.192+00	2024-09-11 23:07:17.192+00	14	\N
28	\N	cm0yh0hht00019t9b1ysdzyt9	21	\N	ASIqaumCyS	2024-11-11	08:01:02.035	12:07:53.719	\N	76	yes	7	\N	Denuo vergo tamen vomica aut tristis votum viriliter vulticulus depromo.	Viduo contego vulticulus quisquam aptus eos tenetur. Accommodo dedecor defetiscor. Defluo ambitus incidunt tondeo dolorum caritas valde.	Ea perspiciatis dignissimos commemoro degusto quaerat carmen aggero adicio trans. Peccatus alienus somnus tracto tamisium cras suscipio theologus vilitas appositus. Quo titulus paulatim expedita trucido talis.	\N	active	760.33	29.06	2024-09-11 23:07:17.192+00	2024-09-11 23:07:17.192+00	21	\N
32	\N	cm0yh0hjk00099t9bhmsau1z8	19	\N	vQ7TNsMQta	2024-11-22	17:58:02.769	22:40:38.233	\N	82	no	1	\N	Magnam turpis accusamus adsidue defero somnus carpo alter.	Vilicus credo trepide adopto. Animadverto paulatim doloremque bene. Tendo tersus virtus totam vere.	Cuius amplitudo cibus. Sollicito et studio. Vitium sodalitas conduco carpo ver abstergo.	\N	completed	338.82	65.09	2024-09-11 23:07:17.193+00	2024-09-11 23:07:17.193+00	19	\N
39	\N	cm0yh0hiz00059t9bgfch29sc	12	\N	8eP91ND9de	2024-10-07	11:28:14.204	22:48:11.109	\N	31	no	5	\N	Qui omnis thesaurus.	Vomer clarus aut clementia. Sui accendo cerno eveniet recusandae tonsor. Torrens coadunatio verbera tres tardus.	Victus vobis allatus aequitas adiuvo amor. Sollers sequi turpis tabesco argentum. Tolero autem tergeo conqueror astrum at aperiam absconditus.	\N	completed	810.67	38.90	2024-09-11 23:07:17.192+00	2024-09-11 23:07:17.192+00	12	\N
2	\N	cm0ygzg4s00095jknhpb8037g	9	\N	XhJB2zKWEG	2025-07-24	05:44:46.341	10:45:36.684	\N	89	no	1	\N	Cernuus denique currus vis cenaculum harum accommodo architecto advoco.	Arcus theologus talus dedico pecco. Sonitus tollo ustulo rerum absens aestivus illo. Nesciunt venio vulnus doloribus tutis adeptio derideo.	Sui vesper deduco aliquid appono somniculosus angelus astrum. Adiuvo capillus auctus averto laudantium deficio. Crudelis stipes catena quos.	\N	assigned	891.48	64.16	2024-09-11 23:06:28.747+00	2024-09-11 23:06:28.747+00	9	\N
17	\N	cm0ygzg4900015jkn2t9kfb9e	3	\N	5SJIH2Qldg	2025-05-13	02:59:18.516	23:43:21.652	\N	89	no	3	\N	Aperte cauda stipes.	Absque cimentarius asper ambitus allatus vociferor substantia. Sursum nesciunt quasi volubilis stella vetus amiculum credo. Addo copiose acerbitas temeritas laudantium aliquid totam adimpleo.	Vulnus totus ager auditor tracto debilito adflicto magni. Admoveo molestiae abstergo. Vociferor conor tempore arbor pecto.	\N	completed	878.23	36.44	2024-09-11 23:06:28.747+00	2024-09-11 23:06:28.747+00	3	\N
29	\N	cm0yh0hht00019t9b1ysdzyt9	13	\N	rfz14eHyyT	2025-06-03	12:22:24.881	05:39:11.105	\N	43	no	6	\N	Tabgo sustineo vis denuncio asperiores admoneo cena delibero itaque crinis.	Delinquo vulnero careo barba valeo tenetur. Sum repudiandae confido comis sapiente vindico. Blandior conculco desino.	Vapulus solutio amoveo infit colligo. Adsuesco creator velum adsidue arbitro sint curriculum. Supra reprehenderit comis acervus acies succedo beatus debitis assumenda sublime.	\N	assigned	575.12	30.48	2024-09-11 23:07:17.192+00	2024-09-11 23:07:17.192+00	13	\N
35	\N	cm0yh0hjk00089t9bqjhkf7qw	14	\N	H5vLNd5czZ	2025-08-01	17:30:23.402	13:03:55.709	\N	99	no	2	\N	Currus eligendi turba dicta saepe.	Patria expedita tenuis comitatus dicta commodi asperiores carus. Praesentium possimus adfectus capto crepusculum accedo urbs deduco texo utrum. Solvo corrumpo aer advenio vulnus contabesco comis careo trepide.	Conservo pectus non voluptatum voveo subseco. Cohibeo accusantium apostolus aeneus demens agnosco sol. Bene decor paens.	\N	cancelled	391.10	30.35	2024-09-11 23:07:17.192+00	2024-09-11 23:07:17.192+00	14	\N
5	\N	cm0ygzg4h00035jknskeeaz43	8	\N	26OdJboqed	2025-02-13	06:28:03.311	21:25:12.23	\N	20	no	5	\N	Beatae nesciunt temptatio voro conicio deprecator.	Vobis adulatio natus uter tamdiu convoco ustulo supra charisma. Canto apostolus ter minus averto. Sulum capitulus aggero bardus aetas voluntarius.	Terreo avaritia veritatis dolores patrocinor accusator victus arbustum allatus defetiscor. Tactus adsidue truculenter laborum fugiat deduco pauper atrox. Vester vehemens curto tardus minus.	\N	active	879.10	95.97	2024-09-11 23:06:28.746+00	2024-09-11 23:06:28.746+00	8	\N
18	\N	cm0ygzg4900015jkn2t9kfb9e	6	\N	9i7vwqPWnD	2025-08-25	02:38:04.219	06:44:40.417	\N	36	yes	5	\N	Excepturi ultra quis vomica aliquam culpo defluo spero.	Desino defaeco recusandae corrigo. Corrupti angustus vado. Vesper aureus commodo terga spiritus territo delectatio amaritudo versus adhaero.	Aureus volva necessitatibus magni tepesco quae confido. Tergo defungo studio capto tricesimus auditor vulpes ubi cura. Arbor creptio canonicus patruus doloremque aurum rem expedita stipes.	\N	assigned	922.31	99.65	2024-09-11 23:06:28.747+00	2024-09-11 23:06:28.747+00	6	\N
21	\N	cm0yh0hiz00059t9bgfch29sc	12	\N	lBzqO7xzq8	2024-10-04	18:31:44.974	07:22:04.006	\N	20	no	5	\N	Vorax complectus clementia minima voveo capitulus capitulus.	Caute verbum facere. Coniuratio cotidie sollicito ter volaticus bibo capto credo virtus tactus. Sustineo artificiose conduco architecto culpo dicta.	Undique deduco odio. Color sunt tempus curis. Solio carpo vinum bellicus demo.	\N	assigned	598.84	22.55	2024-09-11 23:07:17.192+00	2024-09-11 23:07:17.192+00	12	\N
40	\N	cm0yh0hjk00099t9bhmsau1z8	18	\N	pf2w376gTi	2024-10-03	19:01:08.469	10:29:40.558	\N	59	yes	1	\N	Alii doloribus auctus nostrum desolo advenio caterva cribro.	Vorax vomica doloremque. Carmen vesper agnitio tibi. Dicta amplus audentia concido.	Adfero combibo venio acquiro appono. Sapiente arguo vulariter vester vita. Eligendi culpo tergo solio studio vulnus animi avaritia demens ait.	\N	assigned	762.90	18.80	2024-09-11 23:07:17.193+00	2024-09-11 23:07:17.193+00	18	\N
3	\N	cm0ygzg4h00035jknskeeaz43	11	\N	WMxLTVx43E	2024-10-21	23:22:42.319	06:26:17.349	\N	53	no	7	\N	Voluptatem vestigium curiositas.	Adiuvo sollers caveo crur tondeo sulum decumbo cavus temeritas. Bellum tondeo libero bonus carmen advenio crebro aptus ambulo. Subito theologus curtus iusto.	Adopto vulnero comedo pauci adficio sit. Advenio cura conservo utroque tergiversatio. Conduco speculum aegrotatio vulariter colo reiciendis vesica concido.	\N	completed	274.81	32.37	2024-09-11 23:06:28.746+00	2024-09-11 23:06:28.746+00	11	\N
6	\N	cm0ygzg4f00025jkn2l4yd9cs	11	\N	KVk5MRVCGO	2025-02-23	12:46:16.793	03:53:34.943	\N	55	no	2	\N	Tonsor accusantium cura calculus utique villa verus aut thermae.	Auxilium sulum textor articulus tergo taceo. Caste amitto vix nam. Asper temporibus quidem thermae triumphus calamitas careo contego saepe.	Tenuis vaco aperiam conscendo aut. Astrum adstringo patria animi thymum aperte tametsi pauci. Tui vinum triumphus molestiae tamquam concido quaerat qui curo cunctatio.	\N	completed	320.07	29.45	2024-09-11 23:06:28.746+00	2024-09-11 23:06:28.746+00	11	\N
7	\N	cm0ygzg4n00055jknc7zx0mgs	4	\N	gKo8u1GIBD	2025-02-13	17:50:06.099	15:09:51.03	\N	48	yes	1	\N	Tenetur est bene spero timidus veritatis acquiro.	Vilitas truculenter adficio taceo animi. Talio suffoco casus conqueror. Toties comburo coadunatio decumbo volubilis tunc uter aedificium.	Ustulo blanditiis creber summa animi. Doloribus catena demonstro aperiam. Vinum demergo ab adsidue cumque aveho.	\N	active	722.25	99.01	2024-09-11 23:06:28.746+00	2024-09-11 23:06:28.746+00	4	\N
8	\N	cm0ygzfo800005jkn1wsvk7gz	10	\N	OdDVlAmwoi	2024-12-24	01:46:19.897	15:51:05.536	\N	18	no	1	\N	Ascit sunt attonbitus.	Audio solvo excepturi porro. Adeptio tonsor voveo. Umbra praesentium clam bos carmen fugiat patruus thymbra.	Adaugeo subseco admitto undique atavus speculum. Desipio demergo vapulus clibanus sperno appello addo denuo dolorum. Antepono aliquid repellendus.	\N	assigned	750.81	47.18	2024-09-11 23:06:28.746+00	2024-09-11 23:06:28.746+00	10	\N
9	\N	cm0ygzg4s00095jknhpb8037g	8	\N	NnH2UB9ZuN	2025-09-08	02:05:16.827	15:06:03.885	\N	39	no	5	\N	Terga earum beneficium voro sustineo terror tam odit.	Creptio strenuus sodalitas derelinquo architecto. Vigor magni adnuo acquiro veritatis bestia. Cubitum defendo charisma suffragium.	Conculco ater tabella spero demo solio terra cum patrocinor vesper. Animus textilis creptio crustulum sortitus coerceo aliquid absconditus aegrus. Succurro decretum cohaero neque viscus convoco demum caelestis viduo comburo.	\N	completed	794.10	45.81	2024-09-11 23:06:28.746+00	2024-09-11 23:06:28.746+00	8	\N
10	\N	cm0ygzg4n00055jknc7zx0mgs	4	\N	8NsolRbyB9	2024-12-25	18:18:56.389	07:12:42.932	\N	29	no	4	\N	Suadeo voluptatibus thalassinus denuncio cervus neque quam tabgo causa desipio.	Facere tracto utor quae similique acervus spiritus cavus vulgivagus. Ducimus calculus sublime. Cras terror delibero viscus spiculum amoveo earum summisse agnosco.	Casus vilicus torqueo thorax ullam virtus tamen vicinus venustas vere. Defleo aeneus deorsum triumphus cinis ulterius. Vulnus depulso stipes incidunt congregatio aegrotatio nulla.	\N	assigned	469.40	41.48	2024-09-11 23:06:28.746+00	2024-09-11 23:06:28.746+00	4	\N
11	\N	cm0ygzg4s00095jknhpb8037g	8	\N	MVT3XomowV	2025-01-14	11:35:54.596	21:18:24.455	\N	51	no	1	\N	Ancilla virga suadeo bos concedo depereo cursim correptius creptio.	Odit crudelis vigor aedificium vorax cunae impedit. Calcar audacia expedita sustineo cado sapiente abstergo. Celo quasi benevolentia conspergo.	Templum villa alius suscipit. Truculenter spectaculum caritas iste. Abeo impedit crudelis arca comes.	\N	active	307.05	39.04	2024-09-11 23:06:28.747+00	2024-09-11 23:06:28.747+00	8	\N
12	\N	cm0ygzg4p00065jkni2m4fzhu	8	\N	aDEKuTqTtF	2025-02-02	06:52:48.089	07:45:11.441	\N	30	yes	1	\N	Alias subito harum caterva deprecator tego demoror ustulo.	Celo arma umquam bardus thesaurus armarium defessus. Crustulum dolores corrigo amoveo a confido callide. Ultio campana vir crapula soleo tendo.	Vel adsum vulgo accendo auxilium vesica voluptas sequi colligo. Custodia impedit cum circumvenio nemo. Porro carpo decipio strues damnatio tepesco.	\N	cancelled	170.73	27.84	2024-09-11 23:06:28.747+00	2024-09-11 23:06:28.747+00	8	\N
13	\N	cm0ygzg4n00055jknc7zx0mgs	6	\N	rlIHofXENN	2024-12-18	21:59:18.587	01:15:06.869	\N	91	yes	7	\N	Cavus temptatio cernuus casus spes crepusculum.	Arguo aperio nulla necessitatibus timidus admoveo alioqui. Delectatio quisquam sublime sequi adopto ducimus ago a claudeo. Accommodo clamo vorax sustineo speciosus vestigium suscipio voluntarius vehemens porro.	Cruciamentum adipiscor atqui virtus adsum comedo caute benigne. Stultus cornu color sequi ter carcer triumphus decipio aveho somnus. Venio vos facere ipsam.	\N	active	814.42	68.56	2024-09-11 23:06:28.747+00	2024-09-11 23:06:28.747+00	6	\N
14	\N	cm0ygzg4f00025jkn2l4yd9cs	4	\N	ep8IS3Uu5S	2025-09-02	17:58:10.907	03:30:17.945	\N	80	yes	5	\N	Degenero demonstro accommodo.	Ascit nam chirographum autem ex abeo atrocitas victus causa. Inventore terminatio creta ipsum comedo. Vero suffragium brevis sub tredecim vir tersus adipiscor valeo.	Amoveo subiungo utilis artificiose cimentarius viridis aut. Considero degero aestus tener vilitas altus vacuus aurum explicabo audeo. Esse vicissitudo crur.	\N	cancelled	214.07	29.82	2024-09-11 23:06:28.747+00	2024-09-11 23:06:28.747+00	4	\N
16	\N	cm0ygzg4i00045jkngyawab4h	5	\N	yspnk1hFZP	2025-03-19	02:37:08.275	09:07:28.106	\N	24	no	4	\N	Degusto atavus patria iusto administratio.	Curiositas acerbitas caveo derelinquo perspiciatis pecus aranea. Vox civis verto. Celer ago vilitas.	Pecto denego taedium civitas basium absque mollitia reiciendis. Suffoco denique conitor adipisci taedium. Credo valens aspernatur aetas.	\N	completed	873.43	12.26	2024-09-11 23:06:28.747+00	2024-09-11 23:06:28.747+00	5	\N
19	\N	cm0ygzg4p00065jkni2m4fzhu	3	\N	dYRYPcEWMT	2024-12-18	05:54:46.588	16:55:44.389	\N	75	yes	5	\N	Capitulus vallum apparatus surgo conturbo autem vae vehemens solio abeo.	Utrum curvo cupio verto summa totam capitulus verbera soleo. Sequi canto suppono demonstro modi absum recusandae. Censura tui aperte ceno vergo.	Tamisium caveo tubineus depereo territo desparatus tollo certus expedita quasi. Callide amiculum deprecator clementia suppono demitto. Usque vinitor ea odio statua.	\N	active	208.85	28.96	2024-09-11 23:06:28.747+00	2024-09-11 23:06:28.747+00	3	\N
22	\N	cm0yh0hjj00079t9bz6ol67xo	12	\N	Y53UegTlW5	2024-12-23	13:14:29.507	03:48:19.678	\N	27	no	6	\N	Sint barba urbs spiritus arbor provident delibero conicio.	Comitatus cubitum asporto. Inventore excepturi talio. Thymum numquam bos cauda atavus derideo.	Iure bestia velit eum velit cumque. Talus vado speculum subnecto talis adeo vereor spes nostrum. Sordeo dignissimos tergeo supellex acidus volva demonstro animadverto.	\N	assigned	588.60	49.43	2024-09-11 23:07:17.192+00	2024-09-11 23:07:17.192+00	12	\N
24	\N	cm0yh0hht00019t9b1ysdzyt9	18	\N	CLE0NWRZC8	2025-01-22	18:57:17.384	19:22:04.043	\N	17	yes	4	\N	Vivo contra labore abbas speculum explicabo.	Verbera conor adsuesco sapiente terror. Substantia dolores autus sumo cognomen. Bardus asper perferendis calcar varietas.	Tepesco abbas vix volubilis pauper adsidue. Somnus id torqueo pel deprecator. Volo demoror vesper vorago officia cavus.	\N	assigned	344.87	23.04	2024-09-11 23:07:17.192+00	2024-09-11 23:07:17.192+00	18	\N
25	\N	cm0yh0hht00019t9b1ysdzyt9	14	\N	3fTaeL2Ux7	2025-04-07	05:23:40.379	16:36:07.422	\N	17	no	8	\N	Surgo provident asperiores.	Facere creta vir totam demitto arbitro atque tergiversatio. Vociferor solio bestia tergum provident volaticus. Amissio cui patria.	Copia tener stips cuppedia capio degenero complectus collum compello cohors. Paulatim porro corrigo distinctio speciosus illo. Uter testimonium clam vado tubineus stabilis studio.	\N	completed	882.02	90.00	2024-09-11 23:07:17.192+00	2024-09-11 23:07:17.192+00	14	\N
26	\N	cm0yh0hiz00059t9bgfch29sc	14	\N	y8iDf6EbzH	2025-05-15	01:25:26.687	20:53:35.83	\N	85	no	8	\N	Coerceo carpo usus.	Voluptas avarus bestia theatrum derelinquo claustrum caveo. Anser condico decumbo asper chirographum depereo utilis beneficium suadeo. Apostolus adversus velum undique fugit theca.	Vetus facilis odio. Commemoro aliquid curriculum communis esse auditor temptatio canto coniecto. Teres comedo tempora succedo amplus adeo pariatur.	\N	assigned	585.36	55.72	2024-09-11 23:07:17.192+00	2024-09-11 23:07:17.192+00	14	\N
33	\N	cm0yh0hht00019t9b1ysdzyt9	21	\N	ERCRIeXPWq	2024-12-10	08:10:31.597	13:02:33.913	\N	92	yes	3	\N	Turbo caelestis armarium vulnero veritatis chirographum vito.	Laborum quia super conturbo. Vaco utique adeptio tabgo avaritia animus ascit. Cupio cultellus adamo vorago cibo vorax contabesco versus decerno.	Dedico sit depereo pauci totam decerno adduco tondeo curso. Terga dedico avarus casus solum degusto. Accommodo sit caries natus color sursum.	\N	assigned	348.36	24.40	2024-09-11 23:07:17.193+00	2024-09-11 23:08:13.294+00	21	\N
30	\N	cm0yh0hjk00099t9bhmsau1z8	18	\N	UyXpPFZdx2	2025-07-22	23:34:46.578	23:05:25.783	\N	67	no	5	\N	Voluptate succedo complectus.	Volup itaque vociferor sortitus sordeo itaque ad esse delicate canis. Cogo delectus thesaurus optio chirographum amicitia pauper doloremque baiulus. Derelinquo substantia triumphus.	Xiphias casso terra adimpleo valetudo vesco cuius magnam congregatio cruciamentum. Solium adamo ab deficio. Blanditiis usitas deprecator et coaegresco delego.	\N	assigned	952.87	46.16	2024-09-11 23:07:17.192+00	2024-09-11 23:07:17.192+00	18	\N
31	\N	cm0yh0h2f00009t9b7c642aqj	21	\N	E7lXm3wyw9	2025-08-22	18:59:28.573	06:20:42.682	\N	98	no	8	\N	Umquam vigor sumo vulgivagus.	Ante victoria depraedor quos perferendis cohibeo demoror distinctio. Synagoga sophismata cernuus stabilis conatus. Curtus conicio attonbitus vaco vulariter curtus careo creo.	Spargo sordeo basium debitis appello tenax. Facere conicio adhuc. Voluntarius officia copia adfero sed.	\N	active	274.03	21.72	2024-09-11 23:07:17.193+00	2024-09-11 23:07:17.193+00	21	\N
37	\N	cm0yh0hjj00079t9bz6ol67xo	15	\N	ydq8dUTDLe	2025-05-24	21:06:04.382	03:45:35.085	\N	94	yes	1	\N	Tandem venio dedecor crapula ustulo ulciscor fugit tempore demitto sumo.	Tamdiu venio beatae numquam tergo turpis cenaculum cornu cruentus. Esse cilicium venustas facilis atavus triumphus timor vestigium pel aro. Usque cubitum tabula ullam cetera theatrum solium.	Sum audio vacuus utrimque perspiciatis aegrotatio abutor sub. Natus vilis ago sodalitas aduro tersus consuasor. Cum appositus cunae argentum amplitudo neque patria.	\N	assigned	863.02	44.71	2024-09-11 23:07:17.193+00	2024-09-11 23:07:17.193+00	15	\N
27	\N	cm0yh0hiz00059t9bgfch29sc	12	\N	uqZkiPU6pM	2025-05-01	10:26:31.741	02:24:42.513	\N	95	yes	4	\N	Umerus defetiscor damnatio amoveo summopere.	Averto tui assentator crur solio fugiat defendo. Somnus degenero molestias atrocitas atrocitas in sopor strenuus ancilla. Agnitio abeo ager pecco templum uter aurum.	Aliquid ascisco tametsi veniam civis. Summopere vado temporibus tres casus consequatur totidem perferendis pariatur. Demergo celebrer stella quam audentia cado umerus tondeo.	\N	completed	760.11	34.73	2024-09-11 23:07:17.192+00	2024-09-11 23:07:17.192+00	12	\N
34	\N	cm0yh0hjk00089t9bqjhkf7qw	21	\N	FSE91JAV5R	2025-03-10	04:16:05.598	22:49:17.683	\N	41	no	6	\N	Stabilis corona aedificium sol tyrannus stella inflammatio debilito audeo copiose.	Nostrum cribro aureus caecus solutio altus complectus. Aequus beneficium termes cubo ad substantia degusto capio. Cariosus vulgus quaerat cursus vulpes.	Strues conservo tonsor altus virgo accusamus vulticulus catena ducimus thymum. Somniculosus infit consequatur suus ait crebro voveo. Cohibeo succedo demonstro colligo cavus coma thymum absconditus apostolus.	\N	completed	166.04	35.34	2024-09-11 23:07:17.193+00	2024-09-11 23:07:17.193+00	21	\N
36	\N	cm0yh0hjk00099t9bhmsau1z8	17	\N	5TfXUFG9G2	2025-01-08	22:11:11.745	01:01:40.474	\N	31	yes	7	\N	Voluptates usque umbra caveo delectus.	Tabella eligendi cognomen aegrotatio claudeo patior. Summopere termes blandior ventus sophismata suppellex enim. Ratione appositus tandem spero vinculum natus contra.	Speculum defero vitium tempora occaecati. Caelum crebro laboriosam stella. Video terreo debeo xiphias ter.	\N	cancelled	468.62	43.79	2024-09-11 23:07:17.193+00	2024-09-11 23:07:17.193+00	17	\N
38	\N	cm0yh0hjk00099t9bhmsau1z8	16	\N	OFsvHEb14u	2025-06-18	21:43:37.054	00:31:57.102	\N	14	no	7	\N	Averto dolorum totus terror volup repellendus acsi abutor textor amissio.	Statua ars bestia demo. Amitto crur demonstro. Autem vinum conscendo titulus copiose cattus vorago capillus.	Clamo candidus templum. Credo aiunt usque. Corrigo tripudio succedo summa vallum barba aureus.	\N	cancelled	991.14	74.64	2024-09-11 23:07:17.193+00	2024-09-11 23:07:17.193+00	16	\N
41	\N	cm0yhd72o00012p1c9yvumwal	23	Direct Delivery	1234	2024-09-12	18:00:00	18:30:00	19:00:00	90	no	\N	\N	Ms. Sheila	Nothing	Its okay	\N	assigned	299.00	25.99	2024-09-11 23:18:24.003+00	2024-09-11 23:21:53.055+00	22	assigned
43	\N	cm0ylxv5q0001394h8csnjnx0	33	Platterz	SV-45091	2024-09-19	10:30:00	11:00:00	11:15:00	50	no	\N	\N	Daniela Ortega	Pick up inside the restaurant. Ask to the person at the kitchen and he will lead you to the correct table to pick up the food (we have multiple tables).	Call Daniela Ortega at 4775808087. She will lead you to the room where you can set up the food.	\N	assigned	210.00	11.00	2024-09-13 01:29:44.515+00	2024-09-13 01:34:40.014+00	34	completed
42	\N	cm0ylxv5q0001394h8csnjnx0	35	Foodee	SV-45090	2024-09-16	10:30:00	11:15:00	11:30:00	40	no	\N	\N	Mariana Ruiz	Go behind main building, knock the door and somebody will open the door for you. Food will be ready on the table next to front desk.	At delivery please contact customer Mariana Ruiz at 4201234321	\N	assigned	350.00	15.00	2024-09-12 21:50:43.667+00	2024-09-13 01:22:17.389+00	34	completed
\.


--
-- Data for Name: dispatch; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.dispatch (id, "cateringRequestId", "createdAt", "driverId", "on_demandId", "updatedAt", "userId") FROM stdin;
cm0yh0jfh00119t9bqmcwi00y	\N	2024-09-11 23:07:18.749+00	cm0yh0hht00019t9b1ysdzyt9	30	2024-09-11 23:07:18.749+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jfh000y9t9b3i99bo71	28	2024-09-11 23:07:18.749+00	cm0yh0hht00019t9b1ysdzyt9	\N	2024-09-11 23:07:18.749+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jfh000v9t9borae8q4o	37	2024-09-11 23:07:18.749+00	cm0yh0hiz00059t9bgfch29sc	\N	2024-09-11 23:07:18.749+00	cm0yh0hjk00089t9bqjhkf7qw
cm0yh0jfh00149t9buy80yq0x	\N	2024-09-11 23:07:18.749+00	cm0yh0hiz00059t9bgfch29sc	25	2024-09-11 23:07:18.749+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jfh000u9t9b91lip44b	32	2024-09-11 23:07:18.749+00	cm0yh0hht00019t9b1ysdzyt9	\N	2024-09-11 23:07:18.749+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jfh00159t9bjcs53f4t	\N	2024-09-11 23:07:18.75+00	cm0yh0hiz00059t9bgfch29sc	22	2024-09-11 23:07:18.75+00	cm0yh0hjk00089t9bqjhkf7qw
cm0yh0jfg000p9t9b2dqlsrjv	38	2024-09-11 23:07:18.749+00	cm0yh0hht00019t9b1ysdzyt9	\N	2024-09-11 23:07:18.749+00	cm0yh0hjk00089t9bqjhkf7qw
cm0yh0jfg000s9t9b5uo1drez	31	2024-09-11 23:07:18.749+00	cm0yh0hiz00059t9bgfch29sc	\N	2024-09-11 23:07:18.749+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jfg000n9t9b3qmcjc09	29	2024-09-11 23:07:18.749+00	cm0yh0hht00019t9b1ysdzyt9	\N	2024-09-11 23:07:18.749+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jff000f9t9bh8bd12u3	23	2024-09-11 23:07:18.748+00	cm0yh0hiz00059t9bgfch29sc	\N	2024-09-11 23:07:18.748+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jff000d9t9b7zo1y2kb	35	2024-09-11 23:07:18.747+00	cm0yh0hht00019t9b1ysdzyt9	\N	2024-09-11 23:07:18.747+00	cm0yh0hjk00089t9bqjhkf7qw
cm0yh0jfg000j9t9bq20s2y01	30	2024-09-11 23:07:18.748+00	cm0yh0hiz00059t9bgfch29sc	\N	2024-09-11 23:07:18.748+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jff000c9t9bumwl2s1o	27	2024-09-11 23:07:18.747+00	cm0yh0hht00019t9b1ysdzyt9	\N	2024-09-11 23:07:18.747+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jfg000l9t9bvbhl2ylk	25	2024-09-11 23:07:18.748+00	cm0yh0hht00019t9b1ysdzyt9	\N	2024-09-11 23:07:18.748+00	cm0yh0hjk00089t9bqjhkf7qw
cm0yh0jfg000h9t9bas1acf59	36	2024-09-11 23:07:18.748+00	cm0yh0hiz00059t9bgfch29sc	\N	2024-09-11 23:07:18.748+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jfh00179t9bro2taer3	22	2024-09-11 23:07:18.748+00	cm0yh0hiz00059t9bgfch29sc	\N	2024-09-11 23:07:18.748+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jpy00199t9bi5g6xssl	40	2024-09-11 23:07:18.75+00	cm0yh0hiz00059t9bgfch29sc	\N	2024-09-11 23:07:18.75+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jq2001b9t9bgwugizs4	\N	2024-09-11 23:07:18.75+00	cm0yh0hht00019t9b1ysdzyt9	26	2024-09-11 23:07:18.75+00	cm0yh0hjk00089t9bqjhkf7qw
cm0yh0jq4001d9t9beplzy226	\N	2024-09-11 23:07:18.75+00	cm0yh0hiz00059t9bgfch29sc	27	2024-09-11 23:07:18.75+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jqt001k9t9bx9dzxvzc	\N	2024-09-11 23:07:18.75+00	cm0yh0hht00019t9b1ysdzyt9	29	2024-09-11 23:07:18.75+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jqs001f9t9bgoqczn3d	\N	2024-09-11 23:07:18.75+00	cm0yh0hht00019t9b1ysdzyt9	18	2024-09-11 23:07:18.75+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jqt001l9t9b516klniu	\N	2024-09-11 23:07:18.75+00	cm0yh0hht00019t9b1ysdzyt9	19	2024-09-11 23:07:18.75+00	cm0yh0hjk00089t9bqjhkf7qw
cm0yh0jqt001h9t9bo00pq5oy	26	2024-09-11 23:07:18.75+00	cm0yh0hht00019t9b1ysdzyt9	\N	2024-09-11 23:07:18.75+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jqy001v9t9bnzwjsp15	\N	2024-09-11 23:07:18.75+00	cm0yh0hiz00059t9bgfch29sc	17	2024-09-11 23:07:18.75+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jqy001s9t9b5mh4kza4	34	2024-09-11 23:07:18.75+00	cm0yh0hiz00059t9bgfch29sc	\N	2024-09-11 23:07:18.75+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jqx001n9t9b02v9szkp	\N	2024-09-11 23:07:18.75+00	cm0yh0hiz00059t9bgfch29sc	20	2024-09-11 23:07:18.75+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jqy001t9t9btrvkv2rl	\N	2024-09-11 23:07:18.75+00	cm0yh0hht00019t9b1ysdzyt9	16	2024-09-11 23:07:18.75+00	cm0yh0hjk00089t9bqjhkf7qw
cm0yh0jr000219t9b487gqx06	21	2024-09-11 23:07:18.75+00	cm0yh0hiz00059t9bgfch29sc	\N	2024-09-11 23:07:18.75+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jqy001u9t9br1hyhawc	\N	2024-09-11 23:07:18.75+00	cm0yh0hiz00059t9bgfch29sc	21	2024-09-11 23:07:18.75+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jr500259t9bb6lqh3wf	\N	2024-09-11 23:07:18.75+00	cm0yh0hiz00059t9bgfch29sc	28	2024-09-11 23:07:18.75+00	cm0yh0hjk00089t9bqjhkf7qw
cm0yh0jqy001x9t9brru0174o	\N	2024-09-11 23:07:18.75+00	cm0yh0hiz00059t9bgfch29sc	23	2024-09-11 23:07:18.75+00	cm0yh0hjk00089t9bqjhkf7qw
cm0yh0jqz001z9t9boims09y5	39	2024-09-11 23:07:18.75+00	cm0yh0hht00019t9b1ysdzyt9	\N	2024-09-11 23:07:18.75+00	cm0yh0hjk00089t9bqjhkf7qw
cm0yh0jr100239t9b7c8w4jo5	24	2024-09-11 23:07:18.75+00	cm0yh0hht00019t9b1ysdzyt9	\N	2024-09-11 23:07:18.75+00	cm0yh0hj800069t9b2tdium2t
cm0yh0k0f00279t9begdcchnc	\N	2024-09-11 23:07:18.75+00	cm0yh0hiz00059t9bgfch29sc	24	2024-09-11 23:07:18.75+00	cm0yh0hj800069t9b2tdium2t
cm0yh0jfh000z9t9bcxm470pa	33	2024-09-11 23:07:18.749+00	cm0ygzg4r00085jkni9natbcv	\N	2024-09-11 23:08:13.294+00	cm0yh0hjk00089t9bqjhkf7qw
cm0yhfbge00052p1c0r9ofgh5	41	2024-09-11 23:18:47.737+00	cm0ygzg4i00045jkngyawab4h	\N	2024-09-11 23:18:47.737+00	cm0yhd72o00012p1c9yvumwal
cm0zvykzp0002113z1oozs1vc	\N	2024-09-12 22:53:27.434+00	cm0ygzg4i00045jkngyawab4h	32	2024-09-12 23:02:07.7+00	cm0ylxv5q0001394h8csnjnx0
cm0zwhldw0007113z1411cutt	\N	2024-09-12 23:08:14.415+00	cm0ygzg4i00045jkngyawab4h	31	2024-09-12 23:08:14.415+00	cm0ylxv5q0001394h8csnjnx0
cm0zy2l560004awbyx166rxm6	\N	2024-09-12 23:52:33.496+00	cm0yh0hht00019t9b1ysdzyt9	34	2024-09-12 23:52:33.496+00	cm0zx6wwu00006gsigu1t5qmn
cm100wjax00026orsxze72geh	\N	2024-09-13 01:11:50.03+00	cm0ygzg4r00085jkni9natbcv	35	2024-09-13 01:11:50.03+00	cm0zx6wwu00006gsigu1t5qmn
cm0ztsyka0003j7q83nnkotrp	42	2024-09-12 21:53:05.864+00	cm0ygzg4i00045jkngyawab4h	\N	2024-09-13 01:18:17.935+00	cm0ylxv5q0001394h8csnjnx0
cm101l6s60002tig8rqzy2k0w	43	2024-09-13 01:31:00.201+00	cm0ygzg4n00055jknc7zx0mgs	\N	2024-09-13 01:31:00.201+00	cm0ylxv5q0001394h8csnjnx0
\.


--
-- Data for Name: failed_job; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.failed_job (id, connection, queue, payload, exception, failed_at) FROM stdin;
\.


--
-- Data for Name: file_upload; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.file_upload (id, "userId", "fileName", "fileType", "fileSize", "fileUrl", "uploadedAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.migrations (id, migration, batch) FROM stdin;
\.


--
-- Data for Name: on_demand; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.on_demand (id, guid, user_id, address_id, order_number, date, pickup_time, arrival_time, complete_time, hours_needed, item_delivered, vehicle_type, client_attention, pickup_notes, special_notes, image, status, order_total, tip, length, width, height, weight, created_at, updated_at, delivery_address_id, driver_status) FROM stdin;
1	\N	cm0ygzg4n00055jknc7zx0mgs	9	R3bD7zI7Ga	2025-02-06	20:02:16.898	17:11:50.646	\N	3	Soap	Van	Congregatio terra adipisci auditor ars quia caterva thymbra articulus appono.	Aer conitor carmen atrox succurro victus. Quasi iure cunctatio explicabo aestas thymbra cur. Utroque audio delectatio vigilo commodi cinis desino torqueo.	Vomer tristis ambulo asporto confido pecus. Stabilis summa nostrum teneo decor curia. Tracto virtus stella substantia.	\N	cancelled	331.41	23.72	42	85	72	23	2024-09-11 23:06:29.874+00	2024-09-11 23:06:29.874+00	9	\N
20	\N	cm0yh0hiq00049t9bg9onlo3a	14	kUQpsnJSmN	2025-01-22	00:26:18.531	13:18:44.068	\N	4	Cheese	Van	Tyrannus adfero beatae cum consequatur urbs accusator curso solium decumbo.	Aureus addo amiculum infit est stella deduco pax. Aliquid stillicidium denego casso curis vir thesis depono vestrum venia. Auctus voluptate quos cetera delibero fugiat.	Animus bos inventore benigne tantillus calcar templum. Conculco vulgaris degusto tamdiu nihil contabesco. Laudantium cilicium solitudo tum necessitatibus.	\N	completed	94.05	48.26	35	20	78	31	2024-09-11 23:07:18.282+00	2024-09-11 23:07:18.282+00	14	\N
2	\N	cm0ygzg4h00035jknskeeaz43	9	btF0lOALGP	2024-10-04	04:21:16.939	18:45:49.065	\N	1	Sausages	Van	Autem pecco vorago pecto appositus summopere amplus.	Despecto cotidie ter dedecor derideo angulus conturbo vado. Templum curia patior truculenter. Confero acquiro congregatio stabilis cibus.	Vitium amplitudo tubineus amplexus. Debeo sodalitas torrens sint eos verbera sublime. Odit distinctio tot dicta curriculum tepesco.	\N	completed	78.36	14.78	23	25	84	7	2024-09-11 23:06:29.874+00	2024-09-11 23:06:29.874+00	9	\N
3	\N	cm0ygzg4i00045jkngyawab4h	10	SEd9UDAVYu	2025-09-07	01:41:02.328	16:10:18.007	\N	1	Keyboard	Van	Caterva defungo vulgaris officiis abutor cupressus.	Arguo depereo argentum agnitio appello denique venio patria subvenio. Audio consectetur aureus victus vehemens ea incidunt capillus. Caelum arto vulariter cura considero temperantia.	Compono valetudo argumentum sollicito veniam validus suspendo aliquid. Uxor talis celebrer terminatio balbus caveo sol. Videlicet sumptus abstergo vomica.	\N	assigned	320.70	35.42	50	77	41	28	2024-09-11 23:06:29.874+00	2024-09-11 23:06:29.874+00	10	\N
4	\N	cm0ygzg4i00045jkngyawab4h	10	JmrqQ6xZs4	2025-03-01	02:13:04.971	14:21:18.334	\N	4	Bike	Car	Eveniet conqueror virga.	Aeternus turpis tertius. Ambitus armarium sponte tumultus decipio dolor defleo torqueo vilitas. Curia aegrotatio tergiversatio omnis villa terga cetera tamdiu certe terreo.	Atque cohibeo contra agnosco spes cilicium deficio. Amplus arma armarium volaticus. Tantillus deorsum verus assumenda adflicto sed abstergo aro.	\N	completed	337.82	36.54	38	56	97	20	2024-09-11 23:06:29.875+00	2024-09-11 23:06:29.875+00	10	\N
5	\N	cm0ygzg4900015jkn2t9kfb9e	8	55EA6EEVHJ	2025-03-13	10:00:35.951	18:52:53.529	\N	4	Shoes	Car	Comparo torrens ipsum voluptatem accusator defleo pel templum.	Tenus combibo thesaurus. Sopor voro aperio conscendo aer hic tutamen non deorsum suppellex. Tero certus debeo iste articulus clamo cogo thorax aestus curso.	Vomica delicate tamen corrigo ex. Cogo tantillus denuo. Tristis vir condico assentator acerbitas credo arca.	\N	assigned	221.38	48.79	81	32	14	36	2024-09-11 23:06:29.874+00	2024-09-11 23:06:29.874+00	8	\N
6	\N	cm0ygzg4q00075jkntte0eslj	3	4fDaVg0JIO	2025-03-21	08:01:20.844	00:39:04.688	\N	3	Mouse	Truck	Capto sequi doloremque ver bellum depraedor.	Laudantium approbo quos vere. Ullus suggero ademptio. Demonstro utrimque aperiam.	Recusandae vociferor necessitatibus vinculum cognomen basium. Custodia bonus varietas cibo. Timidus ars officia audeo adhaero adstringo atavus libero audacia.	\N	active	147.89	35.46	10	36	31	8	2024-09-11 23:06:29.874+00	2024-09-11 23:06:29.874+00	3	\N
8	\N	cm0ygzg4i00045jkngyawab4h	4	kdlyhufwjB	2025-03-30	23:59:44.886	13:18:15.177	\N	3	Bacon	Van	Colo alias pecto stillicidium suspendo ancilla.	Tantillus suscipio tego acsi benevolentia vulgivagus suffragium atque maiores. Repellat vilicus comptus succurro synagoga. Confero natus agnosco ventito complectus utor celo vinculum sustineo.	Deduco verus adsidue super repellat super suadeo beneficium ulciscor illum. Adulatio cuius pauci argumentum advoco mollitia conculco placeat auxilium ipsam. Vulariter vespillo demergo admiratio bos tenuis considero.	\N	cancelled	493.95	47.01	76	69	48	49	2024-09-11 23:06:29.874+00	2024-09-11 23:06:29.874+00	4	\N
7	\N	cm0ygzg4900015jkn2t9kfb9e	2	eC6E4aSQyd	2024-12-03	18:52:05.129	11:19:14.579	\N	3	Table	Van	Patrocinor cubitum vehemens vester suffoco apto.	Uxor attero minima socius asper. Admitto beatus denuncio cotidie textus truculenter doloremque acidus. Volup venustas depraedor celebrer thermae.	Perferendis deripio adsuesco curo. Sordeo nemo cito atqui denique arcesso vaco ocer pariatur. Tergiversatio desparatus vorago blandior distinctio curia sublime capitulus in necessitatibus.	\N	assigned	186.13	16.19	63	26	11	48	2024-09-11 23:06:29.874+00	2024-09-11 23:06:29.874+00	2	\N
9	\N	cm0ygzg4s00095jknhpb8037g	3	6aAc4YmDWA	2025-09-01	23:20:59.478	18:08:57.663	\N	3	Tuna	Car	Ademptio angelus ratione cursim amicitia.	Curso teneo absens advoco vita infit ubi curvo. Denique acies aureus ademptio ipsa defungo. Titulus approbo sponte occaecati careo quia amita debeo.	Tabula civis decens vilicus denique dens totus calcar succedo. Socius cuppedia amo conqueror utroque deserunt arceo adhuc consectetur summisse. Calculus arcesso vomito animus convoco talio arx.	\N	cancelled	52.51	48.21	43	23	10	48	2024-09-11 23:06:29.874+00	2024-09-11 23:06:29.874+00	3	\N
10	\N	cm0ygzg4r00085jkni9natbcv	10	prmSg3VHj4	2025-01-06	07:15:56.316	08:09:05.809	\N	4	Shoes	Car	Commodo debilito celer distinctio vitae ceno velociter.	Admoveo demo desparatus vester admoveo dignissimos amet beneficium. Circumvenio conatus cohibeo charisma sustineo conventus contigo colo sponte venio. Defaeco statim culpa acsi.	Apparatus articulus comparo demulceo decerno. Amissio impedit campana nulla absque. Damnatio aro derelinquo cursus demoror aestivus asper creo.	\N	completed	75.07	39.16	23	68	72	6	2024-09-11 23:06:29.873+00	2024-09-11 23:06:29.873+00	10	\N
11	\N	cm0ygzg4n00055jknc7zx0mgs	5	RFZdUCKV1T	2025-03-01	19:55:02.136	10:20:59.655	\N	2	Chair	Car	Cuppedia sol collum comptus cur.	Cura termes tyrannus tempus cerno attero cuius videlicet. Defungo colo timor comminor demo demulceo contabesco. Antea bos conturbo quasi.	Talis apparatus acidus tametsi volutabrum nam deputo. Verus libero creptio dapifer valetudo surculus sonitus collum totidem conventus. Ultio tracto teneo.	\N	completed	55.86	12.87	60	86	91	9	2024-09-11 23:06:29.874+00	2024-09-11 23:06:29.874+00	5	\N
12	\N	cm0ygzg4900015jkn2t9kfb9e	6	yp9GJgtxLB	2025-04-01	09:57:14.219	21:05:10.923	\N	1	Tuna	Car	Nam velit audacia cervus talis valetudo comitatus acerbitas crastinus.	Virga crastinus supplanto. Reprehenderit curto terreo. Aegre vulgo audeo circumvenio adnuo adopto.	Mollitia adicio ambulo copia infit animadverto clamo quam comminor. Amplitudo voluptate comburo quia vesco corona. Laborum sodalitas dolorem architecto dedecor.	\N	assigned	94.87	22.91	72	73	52	43	2024-09-11 23:06:29.875+00	2024-09-11 23:06:29.875+00	6	\N
13	\N	cm0ygzg4h00035jknskeeaz43	5	KIClihye4S	2025-09-07	03:53:49.551	19:31:31.591	\N	1	Keyboard	Truck	Sodalitas tabernus textor civis non.	Sol acceptus vilitas ancilla spoliatio thymbra. Vesper sustineo pauci porro vos. Exercitationem vesica cupiditas arguo caritas aestus verecundia bestia.	Vulnus appositus suscipit amiculum sui derideo apparatus ancilla. Triduana conforto bellum una cetera caveo adicio vespillo earum. Canto amplexus ulterius.	\N	assigned	174.65	5.13	36	83	68	41	2024-09-11 23:06:29.875+00	2024-09-11 23:06:29.875+00	5	\N
14	\N	cm0ygzg4q00075jkntte0eslj	4	p1CPySt0eq	2025-01-27	08:55:13.114	00:20:16.708	\N	1	Sausages	Van	Campana acidus traho aeger iure.	Consequatur tutamen tyrannus neque conspergo tergeo brevis clibanus thermae. Suscipio clementia callide deporto iste cunctatio conculco anser adversus. Tergo termes utor.	Cursim approbo defleo casso agnitio vulticulus dedecor earum socius. Conventus umquam bene temperantia in praesentium odio convoco creo suggero. Vetus maxime agnitio stella statim avaritia synagoga pariatur aeternus.	\N	completed	70.59	25.54	34	33	99	17	2024-09-11 23:06:29.874+00	2024-09-11 23:06:29.874+00	4	\N
15	\N	cm0ygzfo800005jkn1wsvk7gz	3	Xqg4zXkIff	2025-05-12	21:41:58.965	23:14:33.714	\N	4	Tuna	Van	Peior tondeo tredecim cervus molestias doloribus amita itaque taedium.	Calamitas adhaero sunt vado cedo stipes amiculum. Inventore vel cunae desipio amplus virgo aeneus paens curvo. Aequus absque amoveo vitiosus cumque reiciendis vinum caritas timor.	Tantillus aliquid caute tabula civitas sum ab. Nostrum culpa crudelis abduco culpa odit templum. Cunctatio alioqui verus accusamus depono.	\N	active	264.82	36.08	42	12	30	8	2024-09-11 23:06:29.873+00	2024-09-11 23:06:29.873+00	3	\N
16	\N	cm0yh0hif00039t9bpcq72xuh	18	MCRte3FSay	2025-04-04	22:14:37.426	19:02:06.627	\N	1	Salad	Van	Cimentarius video viriliter benigne suscipit vulticulus aeneus quod dolorum absens.	Adiuvo amitto quidem caries. Traho decens corpus. Voluptatem tantum reiciendis volubilis tricesimus causa tempus nihil tenuis dolore.	Supplanto confero totam utilis clarus cunctatio cometes nostrum. Decet tabgo depopulo cicuta accusantium facere vomito tempora subiungo cur. Astrum sit paulatim ducimus doloremque deporto.	\N	completed	127.96	42.25	57	28	38	36	2024-09-11 23:07:18.282+00	2024-09-11 23:07:18.282+00	18	\N
17	\N	cm0yh0hjk00089t9bqjhkf7qw	20	AvdRkbRENm	2025-01-24	00:22:33.078	11:24:10.957	\N	4	Gloves	Van	Comitatus sordeo vomer coepi velum conservo stips totidem.	Crur canto delectus terreo sol amaritudo carcer adnuo vomer bestia. Aestus tollo vulticulus ver viridis aeneus. Demulceo talis vulgaris supra deorsum ulciscor.	Cupio agnosco suppellex aurum curto velit ancilla. Aperio sed ullam degenero vomica stipes tendo. Argumentum tego uterque.	\N	active	447.82	8.39	43	12	11	7	2024-09-11 23:07:18.282+00	2024-09-11 23:07:18.282+00	20	\N
18	\N	cm0yh0hjj00079t9bz6ol67xo	18	PdGA3ELkUf	2025-04-26	06:21:59.031	18:11:58.534	\N	1	Chair	Truck	Vicinus coepi verbera stultus celer ipsum subseco tertius.	Coma commodo cresco tempora victoria quaerat suffragium blanditiis cuius tempore. Conicio vivo demoror. Comburo denuo alveus spargo.	Argumentum quaerat perferendis defungo quasi aliquid sponte occaecati. Agnosco suscipio conspergo truculenter summopere similique uterque illo ducimus. Cavus crudelis deporto compono abstergo.	\N	completed	496.36	41.45	70	21	75	9	2024-09-11 23:07:18.282+00	2024-09-11 23:07:18.282+00	18	\N
19	\N	cm0yh0hif00039t9bpcq72xuh	20	IprkuPEpf7	2024-12-25	20:26:15.603	06:57:08.254	\N	2	Chicken	Truck	Tricesimus spectaculum unde compono.	Nesciunt tremo degusto caecus vallum aspicio. Sodalitas utilis delectus ait desidero torrens laudantium. Victus somniculosus subnecto.	Carus pecto ascit averto auctor synagoga. Averto cunae atque tempora acer molestiae tenus dolores. Bardus nesciunt alveus trans adflicto amaritudo conventus.	\N	completed	224.40	13.10	89	31	31	41	2024-09-11 23:07:18.282+00	2024-09-11 23:07:18.282+00	20	\N
21	\N	cm0yh0hj800069t9b2tdium2t	15	NlSoybxtwS	2024-12-24	00:29:50.827	15:12:06.448	\N	4	Towels	Car	Centum ad condico derideo thermae virga paulatim decretum.	Decerno ullus stips ambulo cubitum denuo dolor vallum. Ciminatio administratio clamo sumo. Admiratio thalassinus fugiat.	Agnosco bardus currus. Audacia voveo stillicidium taceo thesis vaco deludo illo thesis absconditus. Quo aegre nesciunt uredo cibo vobis tumultus textilis.	\N	cancelled	471.68	7.06	67	34	49	46	2024-09-11 23:07:18.282+00	2024-09-11 23:07:18.282+00	15	\N
22	\N	cm0yh0hj800069t9b2tdium2t	17	hYOfiIh0Ew	2025-02-03	08:54:09.445	12:02:55.891	\N	1	Ball	Van	Vorago arcus et statua creptio aegrotatio angustus anser arto sustineo.	Conturbo damnatio peccatus abundans cur sono calamitas uredo. Inflammatio depopulo stultus adflicto casus a succedo brevis taedium. Alo cognatus carmen laborum tandem vulnus defessus utique cohibeo.	Collum crastinus carbo usus balbus supplanto curtus textus. Acerbitas crur stultus cattus urbanus communis bibo delectatio thorax vigor. Utor soleo adiuvo conqueror tempore curso et bis cura.	\N	active	466.51	25.81	83	44	85	22	2024-09-11 23:07:18.283+00	2024-09-11 23:07:18.283+00	17	\N
23	\N	cm0yh0hif00039t9bpcq72xuh	17	9dboXjGG7M	2025-01-20	13:31:15.049	21:28:05.35	\N	4	Sausages	Truck	Admiratio aliqua conqueror error.	Delinquo bos stultus cupio theatrum tricesimus. Sui soluta baiulus vacuus depromo demonstro comes decens. Conatus auxilium cunabula necessitatibus suffragium.	Artificiose tero stella doloremque benigne ago tribuo victoria vomer spargo. Sulum tempus atqui beatae. Sursum iusto caritas corporis quia debeo copia.	\N	cancelled	268.25	42.82	11	27	53	23	2024-09-11 23:07:18.283+00	2024-09-11 23:07:18.283+00	17	\N
24	\N	cm0yh0hiq00049t9bg9onlo3a	14	hI0HzacoPI	2025-08-18	23:57:47.184	05:17:54.327	\N	2	Salad	Truck	Absorbeo illum caries stips adversus amicitia ante somnus theca.	Admiratio sub illum dolorum. Sperno demonstro valetudo textilis vorax talis adstringo taceo. Uredo omnis pel arbitro tergiversatio venia quidem.	Speciosus tempore patria iste alveus abstergo stella assumenda tutamen solvo. Argumentum temperantia astrum amissio. Eum apostolus victus delego communis rerum speculum.	\N	active	453.05	42.52	78	43	19	26	2024-09-11 23:07:18.283+00	2024-09-11 23:07:18.283+00	14	\N
25	\N	cm0yh0h2f00009t9b7c642aqj	18	jpvRzvziGl	2025-06-27	23:12:43.157	20:22:25.326	\N	4	Shirt	Truck	Derelinquo sit clam commodi corpus totam tibi spectaculum depopulo arma.	Uxor tribuo aperte vespillo. Succedo centum statim virga terreo suscipit somniculosus vox. Abutor spero timidus cetera suffoco.	Absens accedo aliqua crustulum cubicularis bellum viridis socius correptius spargo. Necessitatibus cum vos anser patruus cognomen campana solvo aqua. Coniuratio soluta sulum aduro inventore vado amitto.	\N	cancelled	362.18	11.41	65	32	63	41	2024-09-11 23:07:18.282+00	2024-09-11 23:07:18.282+00	18	\N
26	\N	cm0yh0hiz00059t9bgfch29sc	14	92L2qNL93w	2025-06-02	18:45:20.925	07:43:02.649	\N	4	Hat	Van	Aedificium vos vestrum cernuus defleo texo.	Aveho astrum amplitudo corroboro adsuesco. Cupiditate vito cogo cunae crebro quasi vetus ulciscor. Pauci vestigium tamen quo assentator.	Abduco approbo volva adhaero eos. Voro censura fugit amaritudo paulatim terreo desipio cariosus temeritas. Vita occaecati strues crur demitto cunctatio.	\N	assigned	392.23	30.58	14	97	86	48	2024-09-11 23:07:18.282+00	2024-09-11 23:07:18.282+00	14	\N
27	\N	cm0yh0hht00019t9b1ysdzyt9	13	c9KLLIdF24	2025-05-17	11:37:53.676	12:25:31.509	\N	2	Shoes	Truck	Demum vero alias.	Pauper cernuus cohaero confero pecco stipes creo acervus. Delibero vigor taedium absens. Abeo iure vindico alo denego creator cogito.	Inventore unde blandior crapula. Campana soluta contigo coma cuius torqueo. Tamisium peior qui.	\N	cancelled	230.66	32.50	85	70	80	5	2024-09-11 23:07:18.282+00	2024-09-11 23:07:18.282+00	13	\N
28	\N	cm0yh0hht00019t9b1ysdzyt9	20	GmlwoXeyCf	2025-03-31	00:34:53.675	20:00:13.88	\N	2	Soap	Truck	Tremo caput combibo thorax aiunt solitudo baiulus degero stultus.	Architecto exercitationem tabgo sophismata trado suggero argentum. Absum atrocitas a conqueror arto amitto cultellus. Argentum delego tollo vespillo curo.	Tempus tabula valeo laudantium vos textor. Calamitas tremo subiungo doloremque reiciendis porro defero perspiciatis apparatus certe. Cavus curtus copiose aer substantia tametsi substantia volutabrum amiculum eveniet.	\N	cancelled	243.14	24.90	88	55	48	43	2024-09-11 23:07:18.282+00	2024-09-11 23:07:18.282+00	20	\N
29	\N	cm0yh0hiz00059t9bgfch29sc	14	ThThlfMtms	2025-01-18	03:36:58.225	03:05:11.902	\N	3	Car	Car	Comitatus inventore iste.	Trucido molestias adicio amiculum cetera velociter aegrus accusantium contigo. Caelestis casus triduana facere sopor tum recusandae ullam perspiciatis. Uredo utroque eveniet auditor terreo adulatio volutabrum amplitudo.	Vorax atqui studio custodia odit appono callide civitas. Capitulus vito nam vereor tantillus torqueo amicitia mollitia adipisci. Quam ratione cornu.	\N	completed	438.46	6.93	19	31	89	32	2024-09-11 23:07:18.283+00	2024-09-11 23:07:18.283+00	14	\N
30	\N	cm0yh0hj800069t9b2tdium2t	12	QXeKjtP2jm	2025-02-12	19:28:05.823	20:03:46.147	\N	3	Mouse	Car	Officiis tollo tubineus exercitationem utrum repellat charisma agnosco tenax tamen.	Tactus capitulus adulatio amo atque aegrotatio ventosus absum ut nulla. Arguo bestia cognomen error ad aufero hic talis. Aeternus demergo claustrum aranea eos pauci autus.	Aer delego infit. Confido conspergo volup tametsi aqua vulgivagus cum. Iste apud theologus dicta absque infit somnus cotidie ascisco taedium.	\N	assigned	275.19	15.89	34	61	33	2	2024-09-11 23:07:18.282+00	2024-09-11 23:07:18.282+00	12	\N
32	\N	cm0ylxv5q0001394h8csnjnx0	35	SV-42020	2024-09-16	11:00:00	12:00:00	12:15:00	\N	Pizzas and pasta	Truck	Paper Company	None	None	\N	assigned	598.00	25.00	5.00	3.90	1.54	800 lbs	2024-09-12 21:26:16.02+00	2024-09-12 23:09:32.957+00	33	completed
31	\N	cm0ylxv5q0001394h8csnjnx0	33	SV-42010	2024-09-13	16:10:00	17:00:00	17:15:00	\N	Cathering Order	Car	Copia Express	Go behind the building, knock the door at the back and you will see a table where the food is going to be ready for pick up.	At delivery please contact Mariana at 4152309332, she will open the door for you and put the whole order on the table next to the front desk. Thanks!	\N	assigned	320.05	15.00					2024-09-12 21:15:17.503+00	2024-09-12 23:10:08.586+00	34	completed
33	\N	cm0zx6wwu00006gsigu1t5qmn	38	SF-09091	2024-09-17	10:35:00	11:30:00	11:45:00	\N	Flowers	Van	Miami FC	Go inside the store, make left, then right and at the front desk you can pick up the entire order.	Once you get at location please call Mr. David Beckham and he will le you in. You can drop off on the second floor behind glass doors where main office is located.	\N	active	500.00	50.00	3.5	3.90	1.67	950 lbs	2024-09-12 23:35:47.899+00	2024-09-12 23:35:47.899+00	37	\N
34	\N	cm0zx6wwu00006gsigu1t5qmn	40	SF-21785	2024-09-18	17:40:00	19:30:00	19:45:00	\N	Collectable Toys	Truck	David Robert	Park in front of the main building, take the elevator to third floor. Once you are there, you will see the store called "Hot Toys Inc". Go in there and the order will be ready on the table labed "order for pick up".	Call Mr. David Robert at 4155352534 to coordinate delivery. He can see you at the parking lot.	\N	assigned	1000.00	100.50	7.43	5.10	2.13	1,200 lbs	2024-09-12 23:43:49.604+00	2024-09-12 23:53:31.188+00	41	completed
35	\N	cm0zx6wwu00006gsigu1t5qmn	39	SV-12234	2024-09-18	19:00:00	19:45:00	20:00:00	\N	Laptops	Car	Mariana Ruiz	n/a	n/a	\N	assigned	650.10	45.50	5.00	3.65	1.45	760 lbs	2024-09-12 23:46:56.248+00	2024-09-16 22:45:48.412+00	42	completed
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.session (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."user" (id, guid, name, email, "emailVerified", image, password, "passwordResetToken", "passwordResetTokenExp", type, company_name, contact_name, contact_number, website, street1, street2, city, state, zip, location_number, parking_loading, counties, time_needed, catering_brokerage, frequency, provide, head_count, photo_vehicle, photo_license, photo_insurance, status, side_notes, confirmation_code, remember_token, created_at, updated_at) FROM stdin;
cm0ygmbwh0000fdlrjuzu2ifq	\N	Emmanuel Alanis	ealanisln@me.com	\N	\N	$2b$10$37/jk4iubRlTyVd1N7EW7.92n2MramUIVnGSNyovvB0JqojHVm6Ju	\N	\N	admin	\N	\N	4777314130	\N	Circuito Villa Gerona	145A	León	Guanajuato	37358	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2024-09-11 22:56:15.808+00	2024-09-16 22:24:24.369+00
cm0ygzfo800005jkn1wsvk7gz	\N	Mack Smith	Lexie_Terry@gmail.com	\N	\N	\N	\N	\N	vendor	Ziemann, Zemlak and Rempel	Clint Ferry	(707) 552-5655 x03200	https://tattered-concentration.biz	32780 Juwan Junction	\N	Lansing	Mississippi	59216-3660	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-09-11 23:06:27.221+00	2024-09-11 23:06:27.221+00
cm0ygzg4900015jkn2t9kfb9e	\N	Rodney Zulauf	Telly58@gmail.com	\N	\N	\N	\N	\N	vendor	Haley - Sawayn	Raul Botsford IV	803.879.1717 x83411	https://punctual-pillbox.biz	811 Albert Street	\N	South Javierview	Florida	47997	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	deleted	\N	\N	\N	2024-09-11 23:06:27.221+00	2024-09-11 23:06:27.221+00
cm0ygzg4f00025jkn2l4yd9cs	\N	Danny Howe	Gilda_Jakubowski13@hotmail.com	\N	\N	\N	\N	\N	client	Anderson - Mertz	Anne Champlin	(420) 284-5453 x471	https://warm-pick.org	21798 James Street	\N	Zulaufview	Maine	81252-1790	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	deleted	\N	\N	\N	2024-09-11 23:06:27.221+00	2024-09-11 23:06:27.221+00
cm0ygzg4i00045jkngyawab4h	\N	Jodi Walker	Arnoldo68@yahoo.com	\N	\N	\N	\N	\N	driver	Russel, Bartell and Gulgowski	Delbert Schaefer V	394-532-3532	https://aching-depot.net/	46240 Clay Lane	\N	Huelsboro	Louisiana	26026-4550	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	deleted	\N	\N	\N	2024-09-11 23:06:27.221+00	2024-09-11 23:06:27.221+00
cm0ygzg4p00065jkni2m4fzhu	\N	Gertrude Balistreri	Marquis79@yahoo.com	\N	\N	\N	\N	\N	vendor	Roob LLC	Louise Considine	265.981.5678 x87569	https://ashamed-produce.biz	325 Marjorie Row	\N	Jacklynfurt	Massachusetts	53876-5766	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	deleted	\N	\N	\N	2024-09-11 23:06:27.222+00	2024-09-11 23:06:27.222+00
cm0ygzg4h00035jknskeeaz43	\N	Toby McCullough	Laney_Jerde@hotmail.com	\N	\N	\N	\N	\N	helpdesk	Johnston and Sons	Mrs. Stephanie Brakus	769.858.9041 x42215	https://young-secret.net/	4279 Spencer Turnpike	\N	South Aryanna	Washington	07814	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2024-09-11 23:06:27.221+00	2024-09-11 23:06:27.221+00
cm0ygzg4n00055jknc7zx0mgs	\N	Jerry Hodkiewicz	Mack_Hagenes64@hotmail.com	\N	\N	\N	\N	\N	driver	Hoeger LLC	Spencer Rau	(236) 548-3697 x60320	https://those-hydrant.biz	8625 Ariane Highway	\N	Rosenbaumtown	Texas	00482-9243	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-09-11 23:06:27.222+00	2024-09-11 23:06:27.222+00
cm0ygzg4r00085jkni9natbcv	\N	Maureen Pfeffer	Herbert_Dickens67@gmail.com	\N	\N	\N	\N	\N	driver	McCullough - Buckridge	Nancy Dare	630.603.2050	https://unusual-humor.com/	57075 Ratke Rue	\N	Fort Milo	Maryland	14329	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2024-09-11 23:06:27.221+00	2024-09-11 23:06:27.221+00
cm0ygzg4q00075jkntte0eslj	\N	Donald Davis	Vergie_Hauck83@yahoo.com	\N	\N	\N	\N	\N	client	Nicolas, Connelly and Satterfield	Christina Kuhlman	640.413.3681 x228	https://misguided-cornet.info	541 St George's Road	\N	Peytonville	Tennessee	61700-7395	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2024-09-11 23:06:27.221+00	2024-09-11 23:06:27.221+00
cm0ygzg4s00095jknhpb8037g	\N	Dr. Wilson Greenfelder	Michael_Schiller66@hotmail.com	\N	\N	\N	\N	\N	vendor	Hammes and Sons	Nancy Buckridge	741.666.0990 x6510	https://worse-spear.biz/	78164 Edwina Flat	\N	West Garfield	Mississippi	19037-5759	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2024-09-11 23:06:27.221+00	2024-09-11 23:06:27.221+00
cm0yh0h2f00009t9b7c642aqj	\N	Shari Reichel	Lorenzo.Bayer14@hotmail.com	\N	\N	\N	\N	\N	client	Bartoletti LLC	Laura Okuneva	873.695.5462 x9580	https://known-premier.net	2736 Trystan Underpass	\N	East Owenport	Iowa	50517-3357	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	deleted	\N	\N	\N	2024-09-11 23:07:15.686+00	2024-09-11 23:07:15.686+00
cm0yh0hht00019t9b1ysdzyt9	\N	Cameron Thiel PhD	Newton_Reinger47@yahoo.com	\N	\N	\N	\N	\N	driver	Dach Inc	Claudia Jenkins	521-345-4721 x2655	https://darling-tray.biz/	4692 Norene Extension	\N	Toledo	New York	98920	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2024-09-11 23:07:15.686+00	2024-09-11 23:07:15.686+00
cm0yh0hi400029t9b6cui8oio	\N	Sylvester Graham	Rey_Anderson86@hotmail.com	\N	\N	\N	\N	\N	client	Smith - Cruickshank	Robin Ward	403.798.1512 x126	https://insecure-detective.biz/	458 Cliff Road	\N	Gradyborough	California	75345	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-09-11 23:07:15.686+00	2024-09-11 23:07:15.686+00
cm0yh0hif00039t9bpcq72xuh	\N	Ginger Dooley	Cindy_Luettgen38@gmail.com	\N	\N	\N	\N	\N	helpdesk	Stark and Sons	Ginger Volkman	919.594.9858 x661	https://accurate-prohibition.org/	24623 Josiah Spring	\N	San Francisco	Texas	53510-0860	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-09-11 23:07:15.685+00	2024-09-11 23:07:15.685+00
cm0yh0hiq00049t9bg9onlo3a	\N	Gregory Crona	Roger.Morissette6@yahoo.com	\N	\N	\N	\N	\N	helpdesk	Wyman LLC	Mr. Edwin Rowe	995-961-6699 x897	https://bustling-foodstuffs.name	2391 Water Lane	\N	Youngstown	Michigan	67228-5347	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2024-09-11 23:07:15.686+00	2024-09-11 23:07:15.686+00
cm0yh0hiz00059t9bgfch29sc	\N	Kim Ruecker	Johnny88@hotmail.com	\N	\N	\N	\N	\N	driver	Hansen Group	Kristopher O'Reilly	285-547-3200 x854	https://paltry-daddy.net/	54985 Octavia Corner	\N	Tyreeton	Kansas	26938	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2024-09-11 23:07:15.686+00	2024-09-11 23:07:15.686+00
cm0yh0hj800069t9b2tdium2t	\N	Cora Cremin	Jena.Spinka84@gmail.com	\N	\N	\N	\N	\N	admin	Robel, Greenholt and Kunde	Elsa Kub	477.825.8053 x5422	https://pointed-moment.info/	5790 W Pine Street	\N	Kilbackfield	Indiana	94603	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	deleted	\N	\N	\N	2024-09-11 23:07:15.686+00	2024-09-11 23:07:15.686+00
cm0yh0hjj00079t9bz6ol67xo	\N	Jeanne Emmerich-Emard	Margaret.Kozey9@gmail.com	\N	\N	\N	\N	\N	helpdesk	Dietrich, Kuphal and Beer	Jo Green PhD	286-317-0533 x7166	https://dependable-ceramic.com/	716 Eudora Shoals	\N	Fort Kailyn	Colorado	39215	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-09-11 23:07:15.686+00	2024-09-11 23:07:15.686+00
cm0yh0hjk00089t9bqjhkf7qw	\N	Nichole Goyette	Keely_Hamill12@gmail.com	\N	\N	\N	\N	\N	admin	Volkman LLC	Teri Abshire	818.439.0137 x7505	https://alive-sonnet.info/	52200 Lynch Cove	\N	Harbercester	Louisiana	58194	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2024-09-11 23:07:15.686+00	2024-09-11 23:07:15.686+00
cm0yk8gkz0000r7kkoqf4zd3o	\N	Fernando Cardenas	fsanchezcln@gmail.com	\N	\N	$2b$10$hLdWt/JyoHAWyLJFXrWBGOlT/3xoQ3RopOvnjpee7vAaA00WsuHra	\N	\N	admin	ReadySet	\N	4155352534		547 Miller Av		South San Francisco	California	94080	\N								\N	\N	\N	active	\N	\N	\N	2024-09-12 00:37:27.154+00	2024-09-12 00:49:35.968+00
cm0yh0hjk00099t9bhmsau1z8	\N	Ramiro Hermiston-Lakin	Fanny14@yahoo.com	\N	\N	\N	\N	\N	client	Schmeler - Schowalter	Sophia Cormier	400.782.0059	https://square-omelet.biz	98909 Dallin View		Clementstead	Arizona	82670	\N		San Francisco	Breakfast		6-15 per week		50-74	\N	\N	\N	pending	\N	\N	\N	2024-09-11 23:07:15.686+00	2024-09-11 23:09:04.62+00
cm0yhd72o00012p1c9yvumwal	\N	Mildred S.	prueba1@test.com	\N	\N	$2b$10$xtu8k9k5EAUwFx4J8jzv6eN3cv4J6a.W13Uk6J63LaU6D14wP3mdq	\N	\N	client	UnaMas (Sharing Style)	\N	4157662323		2559 North First Street		San Jose	CA	95131	\N		Marin, San Francisco	Breakfast	\N	6-15 per week	\N	25-49	\N	\N	\N	pending	\N	\N	\N	2024-09-11 23:17:09.262+00	2024-09-11 23:17:09.262+00
cm0yjs2po0001edclp5i68794	\N	Esteban Sanchez	esc1990@gmail.com	\N	\N	$2b$10$6.K7TRh.gW0QgQFPtcUDVO35XFhndcbgcQoOZ.OjD9tqlfGWhnlqS	\N	\N	admin	\N	\N	4102906125	\N	405 Lopez Mateos Ote		Milpitas	California	96210	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2024-09-12 00:24:42.683+00	2024-09-12 00:24:42.683+00
cm0yjbcd60000edcljfu9uzq2	\N	Booker Smith	prueba1234@gmail.com	\N	\N	$2b$10$gOD2dWQfNkeLKy5KQUJRKOkGPfVWAsoObZRhqoO.6p8FWpErEvgTq	\N	\N	vendor	Sprouts Farmers Market	Booker Smith	4155341234	https://www.sprouts.com	370 Gellert Blvd		Daly City	California	95010	\N		San Francisco, San Mateo, Santa Clara, Sonoma	Lunch, Breakfast	Ez Cater, Foodee	over 25 per week	Labels, Utensils		\N	\N	\N	deleted	\N	\N	\N	2024-09-12 00:11:42.041+00	2024-09-12 01:17:20.409+00
cm0yl0py8000035o3mg56cgde	\N	David Carson	cromo181@hotmail.com	\N	\N	$2b$10$8JYmuywxLZXOfDoDO5eea.bPWPeH30zrHXtewXEztLhlpkb7dd6Pm	\N	\N	vendor	Las gorditas de ecatepunk	\N	4112395647	https://www.gorditasecatepunk.com	2000 Alameda de las pulgas 		San Mateo	California	94085	\N		San Mateo, Napa, Alameda	Lunch, Dinner	Grubhub, Zero Cater, Direct Delivery	over 25 per week	Utensils, Napkins, Labels	\N	\N	\N	\N	pending	\N	\N	\N	2024-09-12 00:59:25.663+00	2024-09-12 00:59:25.663+00
cm0ylxv5q0001394h8csnjnx0	\N	Mariana Saldana	marianita1987@hotmail.com	\N	\N	$2b$10$mQaMgLJm9r1d8wDcW/OBQeTVvx7XLl8YyoxFEk2vD4LkgiiKFrAsy	\N	\N	client	Copia Express SA DE CV	Mariana Guadalupe Saldana	4777645893	https://www.copiaexpress.com	25 Alameda		San Carlos	California	94070	\N		San Mateo, Solano, Sonoma	Dinner		1-5 per week		100-124	\N	\N	\N	active	\N	\N	\N	2024-09-12 01:25:12.061+00	2024-09-12 06:26:34.206+00
cm0ymcq1x000055ljqg88b3qk	\N	Esteban Cardenas	esteban_1990@me.com	\N	\N	$2b$10$TDneKkPK3ly1fKePM2Pvf.sEUXMUzptBYSolKNtqFNs7LeRBMV0xu	\N	\N	driver	\N	\N	4202301545		12 Serdan St		Linda Mar	California	90032	\N								\N	\N	\N	active	\N	\N	\N	2024-09-12 01:36:45.284+00	2024-09-16 19:29:50.406+00
cm0ymk8lf000155ljmwu6pe97	\N	David Sanchez	davids2002@gmail.com	\N	\N	$2b$10$WupVn.Ow0P79nuZTE8oTX.OgNSe3El9KgDk4bvZf82etv4gZAkelm	\N	\N	helpdesk	\N	\N	4792608514		98 Monterey Av		Pacifica	California	95020	\N								\N	\N	\N	active	\N	\N	\N	2024-09-12 01:42:35.906+00	2024-09-16 19:34:46.877+00
cm0ylmxor0000394hpr6m7gc8	\N	Alessandra Ambrosio	alessandra1984@gmail.com	\N	\N	$2b$10$zFx9OtuV9tSn7sLq1HOIZ.Q9xByZfN.X2Wt/zVgWpZHJhwhIWdYwK	\N	\N	vendor	Victoria Secret Burgers	Alessandra	6502021012	https://vicburgers.com	21 Beach Av		Santa Clara	California	98010	\N		Contra Costa, Napa, San Mateo	Lunch	Foodee, Ez Cater, Cater Cow	6-15 per week	Napkins, Labels		\N	\N	\N	active	\N	\N	\N	2024-09-12 01:16:42.12+00	2024-09-16 22:25:42.464+00
cm0yxfjr70000ghw35oflurq3	\N	Salvador Serra	salsanchez1302@gmail.com	\N	\N	$2b$10$654ahOhLtR2dafE6V.3c3eoyQyePRdM4KNn16c0lZUSoppwCThrcS	\N	\N	vendor	Dos Vatos Menuderia	Salvador Serra	4103452030	https://www.dosvmenuderia.com	303 Spring Gardens		San Francisco	California	92340	\N		San Mateo, San Francisco, Santa Clara, Alameda	Breakfast	Grubhub, Zero Cater, Cater Cow	6-15 per week	Labels, Napkins		\N	\N	\N	pending	\N	\N	\N	2024-09-12 06:46:52.865+00	2024-09-16 07:13:15.688+00
cm0zux95f0001336jz8cflu9l	\N	Jennifer Andrea Narvaez	jennypretty92@icloud.com	\N	\N	$2b$10$YA8aDn4gH5IrEvxIAQhYr.bUoHqtF6Gq2db/XfYkMbhJJK8wY.W26	\N	\N	driver	\N	\N	5098675309		811 Malaguena St		Santa Cruz	California	95060	\N								\N	\N	\N	active	\N	\N	\N	2024-09-12 22:24:26.258+00	2024-09-16 07:15:05.863+00
cm0zx6wwu00006gsigu1t5qmn	\N	David Beckham	beckham23@gmail.com	\N	\N	$2b$10$WYzSi5ioZYryE7o4nTlJ5uOXbVrm0Xbmdbfk1vh5qLNics5hnVYai	\N	\N	client	Miami FC	David Robert Beckham	6592309871	https://miamifc.org.com	99 Miami Av		Miami	Florida	55023	\N		Napa, Contra Costa, San Francisco, Santa Clara, San Mateo	All Day		over 25 per week		250-299	\N	\N	\N	pending	\N	\N	\N	2024-09-12 23:27:56.189+00	2024-09-16 07:16:58.297+00
\.


--
-- Data for Name: verification_token; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.verification_token (id, identifier, token, expires) FROM stdin;
\.


--
-- Name: address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.address_id_seq', 42, true);


--
-- Name: catering_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.catering_request_id_seq', 43, true);


--
-- Name: failed_job_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.failed_job_id_seq', 1, false);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, false);


--
-- Name: on_demand_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.on_demand_id_seq', 35, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: address address_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pkey PRIMARY KEY (id);


--
-- Name: catering_request catering_request_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.catering_request
    ADD CONSTRAINT catering_request_pkey PRIMARY KEY (id);


--
-- Name: dispatch dispatch_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.dispatch
    ADD CONSTRAINT dispatch_pkey PRIMARY KEY (id);


--
-- Name: failed_job failed_job_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.failed_job
    ADD CONSTRAINT failed_job_pkey PRIMARY KEY (id);


--
-- Name: file_upload file_upload_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.file_upload
    ADD CONSTRAINT file_upload_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: on_demand on_demand_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.on_demand
    ADD CONSTRAINT on_demand_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verification_token verification_token_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.verification_token
    ADD CONSTRAINT verification_token_pkey PRIMARY KEY (id);


--
-- Name: account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON public.account USING btree (provider, "providerAccountId");


--
-- Name: catering_request_order_number_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX catering_request_order_number_key ON public.catering_request USING btree (order_number);


--
-- Name: on_demand_order_number_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX on_demand_order_number_key ON public.on_demand USING btree (order_number);


--
-- Name: session_sessionToken_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "session_sessionToken_key" ON public.session USING btree ("sessionToken");


--
-- Name: user_email_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);


--
-- Name: user_passwordResetToken_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "user_passwordResetToken_key" ON public."user" USING btree ("passwordResetToken");


--
-- Name: verification_token_identifier_token_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX verification_token_identifier_token_key ON public.verification_token USING btree (identifier, token);


--
-- Name: verification_token_token_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX verification_token_token_key ON public.verification_token USING btree (token);


--
-- Name: account account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: address address_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: catering_request catering_request_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.catering_request
    ADD CONSTRAINT catering_request_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.address(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: catering_request catering_request_delivery_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.catering_request
    ADD CONSTRAINT catering_request_delivery_address_id_fkey FOREIGN KEY (delivery_address_id) REFERENCES public.address(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: catering_request catering_request_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.catering_request
    ADD CONSTRAINT catering_request_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: dispatch dispatch_cateringRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.dispatch
    ADD CONSTRAINT "dispatch_cateringRequestId_fkey" FOREIGN KEY ("cateringRequestId") REFERENCES public.catering_request(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: dispatch dispatch_driverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.dispatch
    ADD CONSTRAINT "dispatch_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: dispatch dispatch_on_demandId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.dispatch
    ADD CONSTRAINT "dispatch_on_demandId_fkey" FOREIGN KEY ("on_demandId") REFERENCES public.on_demand(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: dispatch dispatch_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.dispatch
    ADD CONSTRAINT "dispatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: file_upload file_upload_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.file_upload
    ADD CONSTRAINT "file_upload_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: on_demand on_demand_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.on_demand
    ADD CONSTRAINT on_demand_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.address(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: on_demand on_demand_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.on_demand
    ADD CONSTRAINT on_demand_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: default
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

