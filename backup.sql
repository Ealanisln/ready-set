--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6
-- Dumped by pg_dump version 16.6 (Homebrew)

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
-- Name: FormSubmissionType; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public."FormSubmissionType" AS ENUM (
    'food',
    'flower',
    'bakery',
    'specialty'
);


ALTER TYPE public."FormSubmissionType" OWNER TO "default";

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
    'helpdesk',
    'super_admin'
);


ALTER TYPE public.users_type OWNER TO "default";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: FormSubmission; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."FormSubmission" (
    id text NOT NULL,
    "formType" public."FormSubmissionType" NOT NULL,
    "userId" text,
    "companyName" text,
    "contactName" text,
    email text,
    phone text,
    counties text[],
    frequency text,
    "pickupAddress" jsonb,
    specifications jsonb,
    notes text,
    "syncedToSheets" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "additionalComments" text,
    website text
);


ALTER TABLE public."FormSubmission" OWNER TO "default";

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
    id text NOT NULL,
    county text,
    street1 text NOT NULL,
    street2 text,
    city text NOT NULL,
    state text NOT NULL,
    zip text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdBy" text,
    "isRestaurant" boolean DEFAULT false NOT NULL,
    "isShared" boolean DEFAULT false NOT NULL,
    "locationNumber" text,
    "parkingLoading" text,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    name text
);


ALTER TABLE public.address OWNER TO "default";

--
-- Name: catering_request; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.catering_request (
    id bigint NOT NULL,
    guid text,
    user_id text NOT NULL,
    address_id text NOT NULL,
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
    delivery_address_id text NOT NULL,
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
-- Name: file_upload; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.file_upload (
    id text NOT NULL,
    "userId" text,
    "fileName" text NOT NULL,
    "fileType" text NOT NULL,
    "fileSize" integer NOT NULL,
    "fileUrl" text NOT NULL,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "cateringRequestId" bigint,
    "onDemandId" bigint,
    "entityType" text NOT NULL,
    "entityId" text NOT NULL,
    category text
);


ALTER TABLE public.file_upload OWNER TO "default";

--
-- Name: on_demand; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.on_demand (
    id bigint NOT NULL,
    guid text,
    user_id text NOT NULL,
    address_id text NOT NULL,
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
    delivery_address_id text NOT NULL,
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
    status public.users_status DEFAULT 'pending'::public.users_status NOT NULL,
    side_notes text,
    confirmation_code text,
    remember_token character varying(100),
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isTemporaryPassword" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."user" OWNER TO "default";

--
-- Name: userAddress; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."userAddress" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "addressId" text NOT NULL,
    alias text,
    "isDefault" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."userAddress" OWNER TO "default";

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
-- Name: catering_request id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.catering_request ALTER COLUMN id SET DEFAULT nextval('public.catering_request_id_seq'::regclass);


--
-- Name: on_demand id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.on_demand ALTER COLUMN id SET DEFAULT nextval('public.on_demand_id_seq'::regclass);


--
-- Data for Name: FormSubmission; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."FormSubmission" (id, "formType", "userId", "companyName", "contactName", email, phone, counties, frequency, "pickupAddress", specifications, notes, "syncedToSheets", "createdAt", "updatedAt", "additionalComments", website) FROM stdin;
cm5zztii40000l5039q9vwydl	food	\N	Fresh Bites Kitchen	Sarah Thompson	s.thompson@freshbites.com	(555) 123-4567	{Alameda,SanFrancisco,SanMateo}	N/A	{"zip": "97030", "city": "Springfield", "state": "California", "street": "487 Cedar Street"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"6 days (Monday-Saturday)\\",\\"serviceType\\":\\"Year-round\\",\\"deliveryRadius\\":\\"5 miles from each store location\\",\\"totalStaff\\":\\"15 employees\\",\\"expectedDeliveries\\":\\"75-100 deliveries\\",\\"partneredServices\\":\\"None currently\\",\\"multipleLocations\\":\\"Yes - 2 locations\\",\\"deliveryTimes\\":[\\"lunch\\",\\"dinner\\"],\\"orderHeadcount\\":[\\"25-49\\"],\\"frequency\\":\\"6-10\\"}}"		f	2025-01-17 00:00:01.516	2025-01-17 00:00:01.516	n/a	 www.freshbiteskitchen.com
cm5zzuncg0001l503ik15ip5r	food	\N	Fresh Bites Kitchen	Sarah Thompson	s.thompson@freshbites.com	(555) 123-4567	{Alameda,SanFrancisco,SanMateo}	N/A	{"zip": "97030", "city": "Springfield", "state": "California", "street": "487 Cedar Street"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"6 days (Monday-Saturday)\\",\\"serviceType\\":\\"Year-round\\",\\"deliveryRadius\\":\\"5 miles from each store location\\",\\"totalStaff\\":\\"15 employees\\",\\"expectedDeliveries\\":\\"75-100 deliveries\\",\\"partneredServices\\":\\"None currently\\",\\"multipleLocations\\":\\"Yes - 2 locations\\",\\"deliveryTimes\\":[\\"lunch\\",\\"dinner\\"],\\"orderHeadcount\\":[\\"25-49\\"],\\"frequency\\":\\"6-10\\"}}"		f	2025-01-17 00:00:54.371	2025-01-17 00:00:54.371	n/a	 www.freshbiteskitchen.com
cm5zwj2fm0000ian8p3dq8jwy	food	\N	Fresh Bites Kitchen	Sarah Thompson	s.thompson@freshbites.com	(555) 123-4567	{SanFrancisco,Napa,SanMateo}	6-10	{"zip": "97050", "city": " Springfield", "state": "California", "street": "487 Cedar Street"}	"{\\"driversNeeded\\":\\"6 days (Monday-Saturday)\\",\\"serviceType\\":\\"Year-round\\",\\"deliveryRadius\\":\\"5 miles from each store location\\",\\"totalStaff\\":\\"15 employees\\",\\"expectedDeliveries\\":\\"75-100 deliveries\\",\\"partneredServices\\":\\"None currently\\",\\"multipleLocations\\":\\" Yes - 2 locations\\",\\"deliveryTimes\\":[\\"lunch\\",\\"dinner\\"],\\"orderHeadcount\\":[\\"50-74\\"],\\"frequency\\":\\"6-10\\"}"		f	2025-01-16 22:27:55.28	2025-01-16 22:27:55.28	\N	\N
cm6016t8t0000kv03zziyqr94	flower	\N	Main Street Flowers	Sarah Johnson	info@mainstreetflowers.biz	 (555) 123-4567	{SanFrancisco,Napa}	N/A	{"zip": "95060", "city": "San Mateo", "state": "California", "street": "123 Main Street, Suite 101"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"5 days (Monday through Friday)\\",\\"serviceType\\":\\"Year-round, with additional staff during peak seasons (Valentine's Day, Mother's Day)\\",\\"deliveryRadius\\":\\"15-mile radius from downtown location\\",\\"deliveryTypes\\":[\\"floralArrangements\\",\\"floralSupplies\\"],\\"deliveryFrequency\\":\\"2-3 delivery runs per day during business hours (9am-5pm)\\",\\"supplyPickupFrequency\\":\\"Twice weekly (Monday and Thursday mornings)\\",\\"brokerageServices\\":[\\"ftd\\"]}}"		f	2025-01-17 00:38:21.581	2025-01-17 00:38:21.581	We need an exceptional service beyond our expectations!!	 www.mainstreetflowers.biz
cm601pq2l0000js03bjmp9rzt	bakery	\N	Main Street Bakery	Sarah Johnson	info@mainstreetflowers.biz	(555) 123-4567	{Alameda,Marin,SanFrancisco,Solano,ContraCosta,Napa,SanMateo,Sonoma}	N/A	{"zip": "95020", "city": "Los Altos", "state": "California", "street": "123 Main Street, Suite 101"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"  5 days (Monday through Friday)\\",\\"serviceType\\":\\"Year-round, with additional staff during peak seasons (Valentine's Day, Mother's Day)\\",\\"deliveryRadius\\":\\"15-mile radius from downtown location\\",\\"deliveryTypes\\":[\\"bakedGoods\\",\\"supplies\\"],\\"deliveryFrequency\\":\\"2-3 delivery runs per day during business hours (9am-5pm)\\",\\"supplyPickupFrequency\\":\\"Twice weekly (Monday and Thursday mornings)\\",\\"partnerServices\\":\\"no\\",\\"routingApp\\":\\"na\\"}}"		f	2025-01-17 00:53:03.932	2025-01-17 00:53:03.932	Here's a detailed sample profile for a bakery delivery service:\nBAKERY DELIVERY QUESTIONNAIRE\nHow many days per week do you require drivers?\n\n7 days per week\nPrimary delivery hours: 4:00 AM - 2:00 PM daily\nExtended hours for special events and catering\nPre-dawn delivery route for wholesale accounts (restaurants, cafes, hotels)\nMultiple delivery waves to ensure fresh morning pastries\n\nWill this service be seasonal or year-round?\n\nYear-round operation with seasonal menu variations\nPeak seasons include:\n\nHoliday season (November-December)\nWedding season (May-September)\nGraduation period (May-June)\nBack-to-school (August-September)\n\n\nAdditional staffing during high-volume periods\nSpecial holiday menus require expanded delivery windows\n\nWhat delivery radius or areas do you want to cover from your store?\n\nCore delivery zone: 20-mile radius from bakery\nExtended catering delivery up to 35 miles\nCoverage includes:\n\nDowntown cafe and restaurant district\nBusiness parks (corporate catering)\nReside	 www.mainstreetbakery.com
cm602lrwl0000ld039k314ula	specialty	\N	Metro Specialized Pharmacy	Sarah Chen	schen@metropharma.com	(503) 555-0123	{Alameda,Marin,SanFrancisco,Solano,SanMateo,Sonoma}	N/A	{"zip": "95000", "city": "San Francisco", "state": "California", "street": "1842 Healthcare Drive"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"5 days per week\\",\\"serviceType\\":\\"Year-round\\",\\"deliveryRadius\\":\\"25-mile radius from store location, covering greater Portland metro area\\",\\"deliveryTypes\\":[\\"specialDelivery\\",\\"specialtyDelivery\\"],\\"deliveryFrequency\\":\\"Monday through Friday, typically 3-5 deliveries per day\\",\\"supplyPickupFrequency\\":\\"Weekly pickup from main supplier, usually on Mondays\\",\\"fragilePackage\\":\\"yes\\",\\"packageDescription\\":\\"Temperature-controlled medical supplies and laboratory specimens, average package size 12\\\\\\"x8\\\\\\"x6\\\\\\", weight typically under 10 lbs. Special handling required with chain of custody documentation.\\"}}"		f	2025-01-17 01:17:59.3	2025-01-17 01:17:59.3	Additional Comments:\nOur specialty pharmacy has been experiencing significant growth in our patient base across the Portland metropolitan area, and we need to establish a robust and compliant delivery infrastructure to match our expansion. I'd like to provide detailed context about our requirements and operational needs to ensure we can establish an effective partnership.\nBACKGROUND AND CONTEXT:\nWe're a specialized pharmacy focusing primarily on oncology, rheumatology, and rare disease medications. We currently serve approximately 2,500 patients, with a 20% growth rate year-over-year. Our current in-house delivery system is becoming overwhelmed, leading to our search for a dedicated specialty courier service. Many of our patients are immunocompromised and unable to travel to traditional pharmacies, making our delivery service essential to their care.\nDELIVERY SPECIFICATIONS:\nTemperature Control Requirements:\n\nCold Chain (2-8°C): Approximately 60% of our deliveries\nControlled Room Tempe	 www.metropharma.com
cm60430yx0000l803xwy7t4fw	food	\N	Las gorditas de ecatepunk	David Carson	cromo181@hotmail.com	4202301545	{Marin,SanFrancisco,Solano,ContraCosta}	N/A	{"zip": "93120", "city": "Burlingame", "state": "California", "street": "12 Sea St"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"4\\",\\"serviceType\\":\\"seasonal\\",\\"deliveryRadius\\":\\"Bay Area\\",\\"totalStaff\\":\\"5\\",\\"expectedDeliveries\\":\\"75-100 deliveries\\",\\"partneredServices\\":\\"None currently\\",\\"multipleLocations\\":\\"Yes - 2 locations\\",\\"deliveryTimes\\":[\\"lunch\\",\\"dinner\\"],\\"orderHeadcount\\":[\\"75-99\\"],\\"frequency\\":\\"6-10\\"}}"		f	2025-01-17 01:59:23.816	2025-01-17 01:59:23.816	all good!	 www.freshbiteskitchen.com
cm604ddkp0000i803dspzg8hb	specialty	\N	Metro Specialized Pharmacy	Sarah Chen	schen@metropharma.com	(503) 555-0123	{Alameda,Marin,SanFrancisco,Solano,SanMateo,Sonoma}	N/A	{"zip": "95000", "city": "San Francisco", "state": "California", "street": "1842 Healthcare Drive"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"5 days per week\\",\\"serviceType\\":\\"Year-round\\",\\"deliveryRadius\\":\\"25-mile radius from store location, covering greater Portland metro area\\",\\"deliveryTypes\\":[\\"specialDelivery\\",\\"specialtyDelivery\\"],\\"deliveryFrequency\\":\\"Monday through Friday, typically 3-5 deliveries per day\\",\\"supplyPickupFrequency\\":\\"Weekly pickup from main supplier, usually on Mondays\\",\\"fragilePackage\\":\\"yes\\",\\"packageDescription\\":\\"Temperature-controlled medical supplies and laboratory specimens, average package size 12\\\\\\"x8\\\\\\"x6\\\\\\", weight typically under 10 lbs. Special handling required with chain of custody documentation.\\"}}"		f	2025-01-17 02:07:26.712	2025-01-17 02:07:26.712	Additional Comments:\nOur specialty pharmacy has been experiencing significant growth in our patient base across the Portland metropolitan area, and we need to establish a robust and compliant delivery infrastructure to match our expansion. I'd like to provide detailed context about our requirements and operational needs to ensure we can establish an effective partnership.\nBACKGROUND AND CONTEXT:\nWe're a specialized pharmacy focusing primarily on oncology, rheumatology, and rare disease medications. We currently serve approximately 2,500 patients, with a 20% growth rate year-over-year. Our current in-house delivery system is becoming overwhelmed, leading to our search for a dedicated specialty courier service. Many of our patients are immunocompromised and unable to travel to traditional pharmacies, making our delivery service essential to their care.\nDELIVERY SPECIFICATIONS:\nTemperature Control Requirements:\n\nCold Chain (2-8°C): Approximately 60% of our deliveries\nControlled Room Tempe	 www.metropharma.com
cm604elso0001i803bvgzeue7	food	\N	Copia Express	Esteban Matias Cardenas	marianita1987@hotmail.com	6592309871	{Alameda,Marin,SanFrancisco,Napa}	N/A	{"zip": "55023", "city": "Miami", "state": "Florida", "street": "99 Miami Av"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"3\\",\\"serviceType\\":\\"Year around\\",\\"deliveryRadius\\":\\"5 miles from each store location\\",\\"totalStaff\\":\\"15 employees\\",\\"expectedDeliveries\\":\\"75-100 deliveries\\",\\"partneredServices\\":\\"None currently\\",\\"multipleLocations\\":\\" Yes - 2 locations\\",\\"deliveryTimes\\":[\\"allDay\\"],\\"orderHeadcount\\":[\\"100-124\\"],\\"frequency\\":\\"over25\\"}}"		f	2025-01-17 02:08:23.957	2025-01-17 02:08:23.957	ijskksdckosm	https://www.elmichi87.com
cm604q1ni0000jv030v9wri0x	food	\N	Miami FC	Jennifer Narvaez	beckham23@gmail.com	5098675309	{SanFrancisco,ContraCosta,Napa}	N/A	{"zip": "95060", "city": "Santa Cruz", "state": "California", "street": "811 Malaguena St"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"4\\",\\"serviceType\\":\\"Year-round\\",\\"deliveryRadius\\":\\"15-mile radius from downtown location\\",\\"totalStaff\\":\\"5\\",\\"expectedDeliveries\\":\\"75-100 deliveries\\",\\"partneredServices\\":\\"None currently\\",\\"multipleLocations\\":\\"3 differents locations: San Jose, Santa Clara and Palo Alto\\",\\"deliveryTimes\\":[\\"breakfast\\",\\"lunch\\"],\\"orderHeadcount\\":[\\"200-249\\"],\\"frequency\\":\\"6-10\\"}}"		t	2025-01-17 02:17:17.789	2025-01-17 02:17:18.875	nnjnkjnkjjnkjnjkn	https://www.elmichi87.com
cm600xs370000iawvtpzgfaub	flower	\N	Dos Vatos Menuderia	Salvador Serra	salsanchez1302@gmail.com	4792608514	{Marin,SanFrancisco,ContraCosta,SanMateo}	N/A	{"zip": "94040", "city": "Pacifica", "state": "California", "street": "55 Junipero St"}	"{\\"driversNeeded\\":\\"4\\",\\"serviceType\\":\\"seasonal\\",\\"deliveryRadius\\":\\"15-mile radius from downtown location\\",\\"deliveryTypes\\":[\\"floralArrangements\\",\\"floralSupplies\\"],\\"deliveryFrequency\\":\\"2-3 delivery runs per day during business hours (9am-5pm)\\",\\"supplyPickupFrequency\\":\\"Twice weekly (Monday and Thursday mornings)\\",\\"brokerageServices\\":[\\"dove\\"]}"		f	2025-01-17 00:31:20.176	2025-01-17 00:31:20.176	\N	\N
cm6057mgy0000lb03r57n5nah	flower	\N	Las gorditas de ecatepunk	David Carson	cromo181@hotmail.com	4112395647	{Alameda,ContraCosta,Sonoma}	N/A	{"zip": "94085", "city": "San Mateo", "state": "California", "street": "2000 Alameda de las pulgas"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"2\\",\\"serviceType\\":\\"seasonal\\",\\"deliveryRadius\\":\\"15-mile radius from downtown location\\",\\"deliveryTypes\\":[\\"floralArrangements\\",\\"floralSupplies\\"],\\"deliveryFrequency\\":\\"Monday through Friday, typically 3-5 deliveries per day\\",\\"supplyPickupFrequency\\":\\"Twice weekly (Monday and Thursday mornings)\\",\\"brokerageServices\\":[\\"ftd\\",\\"lovingly\\",\\"other\\"]}}"		t	2025-01-17 02:30:57.921	2025-01-17 02:30:59.092	nofnjnlsnNSlfsaklmc	https://www.pastamoonrestaurant.com
cm605ea9q0000js03hlnsj5ci	bakery	\N	Victoria Secret Burgers	Alessandra Ambrosio	alessandra1984@gmail.com	6502021012	{Solano,ContraCosta,Napa}	N/A	{"zip": "95010", "city": "San Mateo", "state": "California", "street": "210 Mamacita St"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"4\\",\\"serviceType\\":\\"Year around\\",\\"deliveryRadius\\":\\"San Mateo Area\\",\\"deliveryTypes\\":[\\"bakedGoods\\",\\"supplies\\"],\\"deliveryFrequency\\":\\"2-3 delivery runs per day during business hours (9am-5pm)\\",\\"supplyPickupFrequency\\":\\"Weekly pickup from main supplier, usually on Mondays\\",\\"partnerServices\\":\\"Instacart\\",\\"routingApp\\":\\"Instacart app\\"}}"		t	2025-01-17 02:36:08.701	2025-01-17 02:36:09.625	/**\n * Understanding Modern Software Development Practices: A Comprehensive Overview\n * \n * This comment provides an in-depth exploration of contemporary software development\n * methodologies, best practices, and emerging trends that shape the industry today.\n * It covers various aspects from code organization to team collaboration and\n * deployment strategies.\n */\n\n/*\n * Section 1: Code Organization and Architecture\n * \n * Modern software development emphasizes clean, maintainable code architecture\n * that can scale with project growth. The foundation begins with proper code\n * organization, following established design patterns and principles that have\n * proven effective over time.\n * \n * One of the most fundamental principles is the separation of concerns (SoC),\n * which advocates for dividing programs into distinct sections, each addressing\n * a specific feature or functionality. This approach not only makes the code\n * more manageable but also facilitates easier testing and maint	https://www.elmichi187.com
cm605w88b0000jw036xk92yw9	specialty	\N	Copia Express	Esteban Cardenas	esteban_1990@me.com	5098675309	{ContraCosta,Napa,SanMateo}	N/A	{"zip": "95060", "city": "Santa Cruz", "state": "California", "street": "811 Malaguena St"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"4\\",\\"serviceType\\":\\"Year around\\",\\"deliveryRadius\\":\\"15-mile radius from downtown location\\",\\"deliveryTypes\\":[\\"specialDelivery\\",\\"specialtyDelivery\\"],\\"deliveryFrequency\\":\\"2-3 delivery runs per day during business hours (9am-5pm)\\",\\"supplyPickupFrequency\\":\\"Twice weekly (Monday and Thursday mornings)\\",\\"fragilePackage\\":\\"yes\\",\\"packageDescription\\":\\"Package fragile. Manage really carefully.\\"}}"		t	2025-01-17 02:50:05.866	2025-01-17 02:50:06.887	dmiqwmdioqmdkmakdmkmdklamdmdwmwn fwjedfwejidjweiodjfweofjwejfw wiofweoifj we fwiojfiwjfoiwejweiwijwfd	https://www.intel.com.us
cm61a64300000js03h2kvr1hr	food	\N	Las gorditas de ecatepunk	Jennifer Narvaez	jennypretty92@icloud.com	5098675309	{SanFrancisco,SanMateo}	N/A	{"zip": "95060", "city": "Santa Cruz", "state": "California", "street": "811 Malaguena St"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"4\\",\\"serviceType\\":\\"Year around\\",\\"deliveryRadius\\":\\"5 miles from each store location\\",\\"totalStaff\\":\\"15 employees\\",\\"expectedDeliveries\\":\\"75-100 deliveries\\",\\"partneredServices\\":\\"None currently\\",\\"multipleLocations\\":\\"Yes - 2 locations\\",\\"deliveryTimes\\":[\\"allDay\\"],\\"orderHeadcount\\":[\\"100-124\\"],\\"frequency\\":\\"11-25\\"}}"		t	2025-01-17 21:37:31.691	2025-01-17 21:37:33.186	Add more deliveries to this order please!	https://www.elmichi187.com
cm61a976r0001js03dqbya5kr	flower	\N	Alessandra Flowers and More	Alessandra Maria Ambrosio	alessandra1984@gmail.com	6592309871	{Dallas,Travis}	N/A	{"zip": "10023", "city": "Dallas", "state": "Texas", "street": "99 Miami Av"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"3\\",\\"serviceType\\":\\"seasonal\\",\\"deliveryRadius\\":\\"Bay Area\\",\\"deliveryTypes\\":[\\"floralArrangements\\",\\"floralSupplies\\"],\\"deliveryFrequency\\":\\"2-3 delivery runs per day during business hours (9am-5pm)\\",\\"supplyPickupFrequency\\":\\"Twice weekly (Monday and Thursday mornings)\\",\\"brokerageServices\\":[\\"flowerShop\\"]}}"		t	2025-01-17 21:39:55.605	2025-01-17 21:39:56.345	Deliveries to all Texas State.	www.flowersalessa.com
cm61acr4c0002js03de8960tp	bakery	\N	Las empanadas de ecatepunk	Esteban Matias Cardenas	cromo181@hotmail.com	4123402289	{Alameda,Marin,SanFrancisco,Solano,ContraCosta,Napa,SanMateo,Sonoma}	N/A	{"zip": "94040", "city": "Pacifica", "state": "California", "street": "10 Pacific Rd"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"6 days (Monday-Saturday)\\",\\"serviceType\\":\\"Year around\\",\\"deliveryRadius\\":\\"25-mile radius from store location, covering greater Bay Area metro area\\",\\"deliveryTypes\\":[\\"bakedGoods\\",\\"supplies\\"],\\"deliveryFrequency\\":\\"2-3 delivery runs per day during business hours (9am-5pm)\\",\\"supplyPickupFrequency\\":\\"Twice weekly (Monday and Thursday mornings)\\",\\"partnerServices\\":\\"Instacart\\",\\"routingApp\\":\\"Instacart app\\"}}"		t	2025-01-17 21:42:41.045	2025-01-17 21:42:42.174	Need to do these deliveries really quick and carefully! Thanks	www.empanadaspunk.mx
cm61axwak0000jv035p2g6kqa	specialty	\N	Miami FC	David Beckham	beckham23@gmail.com	4792608514	{Alameda,Marin,SanFrancisco,SanMateo}	N/A	{"zip": "94045", "city": "San Mateo", "state": "California", "street": "55 Junipero St"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"6 days (Monday-Saturday)\\",\\"serviceType\\":\\"Year around\\",\\"deliveryRadius\\":\\"15-mile radius from downtown location\\",\\"deliveryTypes\\":[\\"specialDelivery\\",\\"specialtyDelivery\\"],\\"deliveryFrequency\\":\\"2-3 delivery runs per day during business hours (9am-5pm)\\",\\"supplyPickupFrequency\\":\\"Twice weekly (Monday and Thursday mornings)\\",\\"fragilePackage\\":\\"yes\\",\\"packageDescription\\":\\"Packages really fragile. Handle them carefully.\\"}}"		t	2025-01-17 21:59:07.963	2025-01-17 21:59:09.347	nkfsaknsaklfnla vasjfasfjasjdflkjaskfkasfjklasjfdlsjaf;lsajfklfsdvjslfasjdjasdklajdakd;laskdasl;jfkasjflasdfl;a;l	https://www.elmichi87.com
cm61dkvvc0000gpm2d8b05lsf	food	\N	Ready Set	Emmanuel	ealanisln@me.com	4157698180	{Solano,Dallas}	N/A	{"zip": "94070", "city": "San Carlos", "state": "CA", "street": "123 Main St"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"5\\",\\"serviceType\\":\\"season\\",\\"deliveryRadius\\":\\"5 mi\\",\\"totalStaff\\":\\"5\\",\\"expectedDeliveries\\":\\"4\\",\\"partneredServices\\":\\"i dont have any partner\\",\\"multipleLocations\\":\\"no\\",\\"deliveryTimes\\":[\\"breakfast\\",\\"lunch\\"],\\"orderHeadcount\\":[\\"75-99\\",\\"100-124\\"],\\"frequency\\":\\"6-10\\"}}"		t	2025-01-17 23:12:59.735	2025-01-17 23:13:01.227	Bla bla text additional info	alanis.dev
cm67ansuc0000gp4p5gsn2l4h	flower	\N	Ready Set	Emmanuel	ealanisln@me.com	4157698180	{SanFrancisco,Dallas}	N/A	{"zip": "94070", "city": "San Carlos", "state": "CA", "street": "123 Main St"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"5\\",\\"serviceType\\":\\"Year around\\",\\"deliveryRadius\\":\\"5 mi\\",\\"deliveryTypes\\":[\\"floralSupplies\\"],\\"deliveryFrequency\\":\\"Daily\\",\\"supplyPickupFrequency\\":\\"Each 3rd day\\",\\"brokerageServices\\":[\\"dove\\",\\"ftd\\"]}}"	\N	t	2025-01-22 02:37:53.988	2025-01-22 02:37:55.914	Testing comments box	N/A
cm67ar1ya0000gpqm0k007ruz	food	\N	Ready Set	Emmanuel	ealanisln@me.com	4157698180	{SanFrancisco,Travis}	N/A	{"zip": "94070", "city": "San Carlos", "state": "CA", "street": "123 Main St"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"5\\",\\"serviceType\\":\\"Year around\\",\\"deliveryRadius\\":\\"10 mi\\",\\"totalStaff\\":\\"5\\",\\"expectedDeliveries\\":\\"15-20 per day\\",\\"partneredServices\\":\\"i dont have any partner\\",\\"multipleLocations\\":\\"Yes, multiple locations\\",\\"deliveryTimes\\":[\\"lunch\\",\\"dinner\\"],\\"orderHeadcount\\":[\\"25-49\\",\\"50-74\\"],\\"frequency\\":\\"6-10\\"}}"	\N	t	2025-01-22 02:40:25.757	2025-01-22 02:40:26.736	Additional text box comments! 	readysetllc.com
cm67atasg0001gpqmxp66ur76	bakery	\N	Ready Set	Emmanuel Alanis	ealanisln@me.com	4152266872	{SanFrancisco,ContraCosta,Dallas,Travis}	N/A	{"zip": "94108", "city": "San Francisco", "state": "California", "street": "166 Geary St"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"8\\",\\"serviceType\\":\\"Year around\\",\\"deliveryRadius\\":\\"10 mi\\",\\"deliveryTypes\\":[\\"supplies\\"],\\"deliveryFrequency\\":\\"each 2nd day\\",\\"supplyPickupFrequency\\":\\"Each 3rd day\\",\\"partnerServices\\":\\"ezcater\\",\\"routingApp\\":\\"coolfire\\"}}"	\N	t	2025-01-22 02:42:10.437	2025-01-22 02:42:11.192	Additional comments box	alanis.dev
cm67auetp0002gpqmsbhzma07	specialty	\N	Ready Set	Emmanuel	ealanisln@me.com	4157698180	{SanFrancisco,Dallas}	N/A	{"zip": "94070", "city": "San Carlos", "state": "CA", "street": "123 Main St"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"5\\",\\"serviceType\\":\\"Year around\\",\\"deliveryRadius\\":\\"5 mi\\",\\"deliveryTypes\\":[\\"specialDelivery\\"],\\"deliveryFrequency\\":\\"Daily\\",\\"supplyPickupFrequency\\":\\"Each 3rd day\\",\\"fragilePackage\\":\\"yes\\",\\"packageDescription\\":\\"Small boxes, auto parts\\"}}"	\N	t	2025-01-22 02:43:02.325	2025-01-22 02:43:03.367	Additional box comments	readysetllc.com
cm67b6m2a0000gpcw92vqmchb	food	\N	Ready Set	Emmanuel	ealanisln@me.com	4157698180	{Alameda,Marin,SanFrancisco}	N/A	{"zip": "94070", "city": "San Carlos", "state": "CA", "street": "123 Main St"}	"{\\"specifications\\":{\\"driversNeeded\\":\\"5\\",\\"serviceType\\":\\"Year around\\",\\"deliveryRadius\\":\\"5 mi\\",\\"totalStaff\\":\\"5\\",\\"expectedDeliveries\\":\\"4\\",\\"partneredServices\\":\\"i dont have any partner\\",\\"multipleLocations\\":\\"no\\",\\"deliveryTimes\\":[\\"lunch\\",\\"dinner\\"],\\"orderHeadcount\\":[\\"50-74\\",\\"75-99\\"],\\"frequency\\":\\"6-10\\"}}"	\N	t	2025-01-22 02:52:31.665	2025-01-22 02:52:33.613	Testing additional comments.	readysetllc.com
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
8552cf9d-9e8e-4e66-92cc-1e1cb5e3614a	455013357423b94b850ac9a849fdb1ec227b200ee94e95036286d318f35a77b8	2025-01-30 18:07:26.457688+00	20240911225445_init	\N	\N	2025-01-30 18:07:26.024056+00	1
bf354193-54bc-4aa3-a8a8-79c52c47be0c	67c5549eec92a1269f138b5fee5a3c90ebcfed2bb732ab8fa16aac4a6f8fe9aa	2025-01-30 18:07:27.005763+00	20240911232114_update_driver_status_enum	\N	\N	2025-01-30 18:07:26.614474+00	1
9d3f3eaa-386e-4234-b9f1-08dac4990502	be61c894c559ecfc43d78e67b5ec7efe1e02a3e1181136d3e06a510e59a6fb61	2025-01-30 18:07:42.980688+00	20250130180742_add_missing_changes	\N	\N	2025-01-30 18:07:42.580033+00	1
2153cc20-12f7-41f9-bb83-d22e36cb69fa	c38371b286a0135331b886f77edcc85fe08a2309e9915812ccd3b432190c4cb5	2025-01-30 18:07:27.558828+00	20240911233613_add_file_upload_model	\N	\N	2025-01-30 18:07:27.162721+00	1
f2bae690-7a65-4d3f-98e0-9ec267cc5221	455013357423b94b850ac9a849fdb1ec227b200ee94e95036286d318f35a77b8	2024-09-11 22:54:46.003938+00	20240911225445_init	\N	\N	2024-09-11 22:54:45.574258+00	1
1fc6dbae-eede-44f6-8238-3e63b5de1222	f69c61f740e1d439fd10f6b0c28f5436f4998ef61006fe66065f851b4d90c1aa	2025-01-30 18:07:28.10784+00	20240923230211_add_enum_to_schema	\N	\N	2025-01-30 18:07:27.715338+00	1
445016d3-d38a-4ca0-bbed-c1c5262f8712	67c5549eec92a1269f138b5fee5a3c90ebcfed2bb732ab8fa16aac4a6f8fe9aa	2024-09-11 23:21:14.921776+00	20240911232114_update_driver_status_enum	\N	\N	2024-09-11 23:21:14.534099+00	1
a219a0f6-4361-4adc-8905-1246d1a83422	96e0fbaccec74dc5a2d7610e65ea5f978d2a2f298ab1996e8ef193fb752021c3	2025-01-30 18:07:28.658851+00	20240926215729_added_relation_file_uploads_orders	\N	\N	2025-01-30 18:07:28.26683+00	1
7ff58e25-01e7-43fe-9dac-ac1f8a19774c	c38371b286a0135331b886f77edcc85fe08a2309e9915812ccd3b432190c4cb5	2024-09-11 23:36:14.473424+00	20240911233613_add_file_upload_model	\N	\N	2024-09-11 23:36:14.040919+00	1
daf3adb5-2fbd-440d-b6a4-3708c5d05864	ca2c02ba675175a4937da086857434809b5f66f631068a146daf0b7c57c0f930	2025-01-30 18:07:29.214754+00	20240927153938_added_photo_drivers_files_relationship	\N	\N	2025-01-30 18:07:28.817226+00	1
4be05483-f039-4ccc-b4cf-fec986731dfa	f69c61f740e1d439fd10f6b0c28f5436f4998ef61006fe66065f851b4d90c1aa	2024-09-23 23:02:12.313743+00	20240923230211_add_enum_to_schema	\N	\N	2024-09-23 23:02:11.91586+00	1
91773280-d7b7-45e9-aae5-cf13e7fcb3b0	4c34698d012ef8b189a25ef43f8261bc9e75381f5533bbca0f8c52858e7e5eca	2025-01-30 18:07:29.769751+00	20240927155024_add_entity_fields_to_file_upload	\N	\N	2025-01-30 18:07:29.372795+00	1
674e615d-1c09-45d9-8f75-fe5faa8f9742	96e0fbaccec74dc5a2d7610e65ea5f978d2a2f298ab1996e8ef193fb752021c3	2024-09-26 21:57:30.085023+00	20240926215729_added_relation_file_uploads_orders	\N	\N	2024-09-26 21:57:29.676583+00	1
24e6f145-da68-4a2d-b597-9c7b2ac785f9	4fff16aec49c4df9449a8dc7e3944ccb0ef939a400b2953729257c908e27874a	2025-01-30 18:07:30.325635+00	20240927155127_fields_upload	\N	\N	2025-01-30 18:07:29.930175+00	1
d2ef75a6-da24-418c-b8b3-bd0070a89452	662c013c981cd87dda8b4245f857ab9de9c74e7341dac4922ba6d55775b7584a	2025-01-16 00:26:00.157298+00	20250116002559_add_additional_comments	\N	\N	2025-01-16 00:25:59.762184+00	1
58452fe8-02aa-44c0-af90-d69ccd9d6129	4c162ec6f066f613e8dc9ed2ccb2fcf93796c1041a39e7b732fe27201b5d90cd	2025-01-30 18:07:30.897711+00	20241001234942_add_address_tables	\N	\N	2025-01-30 18:07:30.482582+00	1
cbbf74d5-4556-4aa8-83a8-aed61c7fc553	ca2c02ba675175a4937da086857434809b5f66f631068a146daf0b7c57c0f930	2024-09-27 15:39:39.571832+00	20240927153938_added_photo_drivers_files_relationship	\N	\N	2024-09-27 15:39:39.11971+00	1
9bfcad54-94ed-4f75-8f9b-79f28ece6c27	f36ac10666b1edb41fa39e2ad36b076ea1a1fe023b9634a602b46359a9adb56d	2025-01-30 18:07:31.449254+00	20241001235355_address_tables_updated	\N	\N	2025-01-30 18:07:31.05525+00	1
4c82b4c7-b73e-47a2-b24c-0c2f24473973	4c34698d012ef8b189a25ef43f8261bc9e75381f5533bbca0f8c52858e7e5eca	2024-09-27 15:50:55.626277+00	20240927155024_add_entity_fields_to_file_upload	\N	\N	2024-09-27 15:50:55.215869+00	1
21b37206-47c9-4fe8-bfcc-9d84a8590690	cd46ba7874054bf0aa8f9599b46e65e69a4ebde2ad41957ed6bae6abeab9d22a	2025-01-30 18:07:31.997862+00	20241002002319_added_name_field	\N	\N	2025-01-30 18:07:31.606322+00	1
3cf7ecf4-f110-44d1-a885-880f327e194d	4fff16aec49c4df9449a8dc7e3944ccb0ef939a400b2953729257c908e27874a	2024-09-27 15:51:28.087674+00	20240927155127_fields_upload	\N	\N	2024-09-27 15:51:27.643094+00	1
655bb2c7-3984-4d16-940f-3ef211d40850	48004a3c98758022dd9350b0899b883948817a60c3de1fc8221a60d625f3d254	2025-01-30 18:07:32.547915+00	20241016165720_temporary_password_field	\N	\N	2025-01-30 18:07:32.15517+00	1
cea3533f-6822-45e3-bdf9-44d07d20d79c	46249226aa96a659be75ab64197550a5a3355b9e48b929a028fd982dec284698	2025-01-16 19:03:05.004314+00	20250116190304_added_website_column	\N	\N	2025-01-16 19:03:04.594251+00	1
0b490d39-41b5-4a78-97c3-22ab8fa43ce2	7c8edcd5f50c7c6316944c53e5c8ee109a15ede484f8e152319eb8c3cbcb232f	2025-01-30 18:07:33.105352+00	20241017163026_add_cascade_delete	\N	\N	2025-01-30 18:07:32.705627+00	1
72d22775-07ad-43a7-a492-08b4f5e5e6a3	4c162ec6f066f613e8dc9ed2ccb2fcf93796c1041a39e7b732fe27201b5d90cd	2024-10-01 23:53:39.648777+00	20241001234942_add_address_tables	\N	\N	2024-10-01 23:53:39.212437+00	1
6bc60f19-1ac4-48d7-8491-66a23ed3741b	f36ac10666b1edb41fa39e2ad36b076ea1a1fe023b9634a602b46359a9adb56d	2024-10-01 23:53:56.486154+00	20241001235355_address_tables_updated	\N	\N	2024-10-01 23:53:56.090719+00	1
fe46d3e9-4941-4f5c-b8dc-abad61f12e45	cd46ba7874054bf0aa8f9599b46e65e69a4ebde2ad41957ed6bae6abeab9d22a	2024-10-02 00:23:20.202263+00	20241002002319_added_name_field	\N	\N	2024-10-02 00:23:19.788616+00	1
e7f156b6-3fd7-46ac-a214-e12d00d35225	48004a3c98758022dd9350b0899b883948817a60c3de1fc8221a60d625f3d254	2024-10-16 16:57:21.667168+00	20241016165720_temporary_password_field	\N	\N	2024-10-16 16:57:21.256527+00	1
bdc0c95a-710b-4184-ae71-4f750daf8225	7c8edcd5f50c7c6316944c53e5c8ee109a15ede484f8e152319eb8c3cbcb232f	2024-10-17 16:30:26.923464+00	20241017163026_add_cascade_delete	\N	\N	2024-10-17 16:30:26.463728+00	1
dfe5ba6d-7f51-4bfd-bbd9-6c33ec4d01e4	13ecd49e700c19873335fb9285a3f2c6bf70486d74053590ca7862120ffd8be3	2025-01-15 23:30:31.768668+00	20250110231602_add_job_applications	\N	\N	2025-01-15 23:30:31.345937+00	1
0aa43ae9-af2c-4fd9-b3cc-df329a56810e	319ae8ae847d79c3cfa9aab86b1cdb76ebee2cf72d8bdc2c2849b2c063a477a4	2025-01-15 23:30:53.388926+00	20250115233052_add_quotes	\N	\N	2025-01-15 23:30:52.977341+00	1
\.


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.account (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.address (id, county, street1, street2, city, state, zip, "createdAt", "createdBy", "isRestaurant", "isShared", "locationNumber", "parkingLoading", "updatedAt", name) FROM stdin;
cm6jnpon40001i3jlrzn269sp	San Francisco	6214 North Lamar Boulevard  	Unit: B	Austin	TX	78752	2025-01-30 18:16:30.975	cm1fkjwho00009vg82l7w8bl8	t	t	760-123-2323	at front	2025-01-30 18:22:22.931	Ranch Hand
cm6jnrgy40003i3jlpafmr32u	San Mateo	501 Congress Avenue 	Floor: 4	Austin	TX	78701	2025-01-30 18:17:54.234	cm1fkjwho00009vg82l7w8bl8	f	t	650-123-2323	no	2025-01-30 18:22:23.135	Navan - Sam Prieto
\.


--
-- Data for Name: catering_request; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.catering_request (id, guid, user_id, address_id, brokerage, order_number, date, pickup_time, arrival_time, complete_time, headcount, need_host, hours_needed, number_of_host, client_attention, pickup_notes, special_notes, image, status, order_total, tip, created_at, updated_at, delivery_address_id, driver_status) FROM stdin;
77	\N	cm1fkjwho00009vg82l7w8bl8	cm6jnpon40001i3jlrzn269sp	Ez Cater	SV-1232323	2025-01-31	20:00:00	20:15:00	21:00:00	50	no	\N	\N	Mr jonson	nothing	its fine	\N	cancelled	499.00	29.00	2025-01-30 18:22:23.213+00	2025-01-30 18:22:23.213+00	cm6jnrgy40003i3jlpafmr32u	\N
\.


--
-- Data for Name: dispatch; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.dispatch (id, "cateringRequestId", "createdAt", "driverId", "on_demandId", "updatedAt", "userId") FROM stdin;
\.


--
-- Data for Name: file_upload; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.file_upload (id, "userId", "fileName", "fileType", "fileSize", "fileUrl", "uploadedAt", "updatedAt", "cateringRequestId", "onDemandId", "entityType", "entityId", category) FROM stdin;
\.


--
-- Data for Name: on_demand; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.on_demand (id, guid, user_id, address_id, order_number, date, pickup_time, arrival_time, complete_time, hours_needed, item_delivered, vehicle_type, client_attention, pickup_notes, special_notes, image, status, order_total, tip, length, width, height, weight, created_at, updated_at, delivery_address_id, driver_status) FROM stdin;
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.session (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."user" (id, guid, name, email, "emailVerified", image, password, "passwordResetToken", "passwordResetTokenExp", type, company_name, contact_name, contact_number, website, street1, street2, city, state, zip, location_number, parking_loading, counties, time_needed, catering_brokerage, frequency, provide, head_count, status, side_notes, confirmation_code, remember_token, created_at, updated_at, "isTemporaryPassword") FROM stdin;
cm1p09lex0000c52xo648i3dz	\N	April	jing@ready-set.co	\N	\N	$2a$10$hHSZBIDZtr9aaQgmgHLa1O6Jtn0qE42w4Kcx.hA9iZfpo9eksGRE2	\N	\N	admin	\N	\N	+639171385390	\N	Mandug		Davao 	Philippines	8000	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-09-30 12:48:14.504+00	2024-09-30 16:28:35.211+00	f
cm2gkgkyr000011g74f3i4zh2	\N	Crystal Rapada	crystal@ready-set.co	\N	\N	$2a$10$KzUug12wfiMPsOSa9TeTo.d7P6bVrxhN7K5I5B4vWOl/RW3jhhmgO	89b83b99bf35d73a1eea89e3e87afe87a918eba38ba8008f7e04ca7ce33a3757	2024-10-20 19:43:19.586	admin	\N	\N	4154042345		246 Hidden Creek Court		Martinez	CA	94553	\N								active	\N	\N	\N	2024-10-19 19:43:19.586+00	2024-10-22 22:07:03.368+00	t
cm1fn7rf50000szk3cpba113x	\N	Fernando Cardenas	fsanchezcln@gmail.com	\N	\N	$2a$10$rrfO38MhgKxduUtVm8Eg4Ox1ynFZXGfql0.FfVnw9pzeToP6peYcS	a4cefbc50aa1118ca06e200eeacce29db3a2e7d1	2024-09-26 02:04:45.454	super_admin	\N	\N	4155352544	\N	1120 Eaton Av Apt 9		San Carlos	California	94070	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-09-23 23:32:58.38+00	2024-09-27 23:52:10.568+00	f
cm1le83w90000o8jzjkqmgm7w	\N	LUTHER C HOMILDA	luther@ready-set.co	\N	\N	$2a$10$8SrP4yhl/rWpych1JRc7GO0Olrka/UEDen23.QGqESI3mENqefMYW	\N	\N	admin	\N	\N	9479366264	\N	MALATABIS, BARANGAY LIZADA, TORIL		DAVAO CITY	DAVAO DEL SUR	8000	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-09-28 00:07:55.063+00	2024-09-28 00:11:31.161+00	f
cm1fkjwho00009vg82l7w8bl8	\N	Emmanuel	ealanis@ready-set.co	\N	\N	$2a$10$nBW1G2u83Szy4cPWQ0tw3u8r.pvgcI4G71eaJs8glha81gpC2KTqe	4113c714194e39ebe8b369dbaa5402cec6bef434	2024-09-25 21:42:43.691	super_admin	Alanis Web Dev		4157698180		123 Main St		San Carlos	CA	94070									active	\N	\N	\N	2024-09-23 22:18:25.978+00	2024-11-13 00:17:54.867+00	f
cm3xlz2zf0000f1mrugdw9sko	\N	Mai Vallejo-Yap	mai3@ready-set.co	\N	\N	$2a$10$cZpMHUpcF2mcd54vr9HCkeeSgJJkCTxP/AVw4VzHMW1cbEHxiygFa	7c38d15245d102036a52ffc08772e91b170079535ff032115848a090a6b38cff	2024-11-26 22:37:29.69	client	RS-Test	\N	+63 9497070741		Sanasa St		Davao CIty	Philippines	90210	\N	Test for the Client Sign Up page	Alameda	Breakfast	\N	1-5 per week	\N	1-24	deleted	\N	\N	\N	2024-11-25 22:37:29.69+00	2024-11-26 16:10:54.97+00	t
cm2ee6e7y0000g58kkqj13dvj	\N	Fer Sanz	fcardenas@ready-set.co	\N	\N	$2a$10$yeNp3SLUA7F9sJHXmtLZZO1yaECh5raAzXMOK7YSAMquRBYGxuzaK	667e09c65ab8202054edae188258f934bb65fd00	2024-10-18 07:22:49.313	driver	\N	\N	4775808089	\N	10 Main St		Burlingame	California	94050	\N	\N				\N		\N	deleted	\N	\N	\N	2024-10-18 07:11:54.237+00	2024-11-20 16:51:27.546+00	t
cm3xlb4im0000dqslfaisudei	\N	Leneth Logrono	leneth@ready-set.co	\N	\N	$2a$10$JC0./sYa1RXxHKsolJ/1A.PGpcuEWGxSTh1wnO/EPwXkR8eJewcNu	d6d0b1d560a3b1588953d082f2365fc1c70997d8ae18be38cb9e9bee57d8dcba	2024-11-26 22:18:51.933	admin	\N	\N	+639153520027	\N	St. Jude 		Davao City	Philippines	8025	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-11-25 22:18:51.933+00	2024-11-26 15:55:06.367+00	f
cm2ce3o5k0000jk45dtqvtcsv	\N	Fernando Cardenas 	cromo181@gmail.com	\N	\N	$2a$10$goJ82HoY65P7RrA.Y2bW9OEw9PBE2zeQP3Pt8Xw1.oKn4kPbaRIne	318146a28862d2c8629fdc766e3cab0bb51498ba0c15051d9c5ce0607efd61f8	2024-10-17 21:34:14.791	driver			4155352534		1120 Eaton Av Apt 10		San Carlos	California	94070									deleted	\N	\N	\N	2024-10-16 21:34:14.791+00	2024-11-26 15:55:26.707+00	f
cm3xj97bz000010e9mgdu6b6i	\N	Mai Vallejo-Yap	mai@ready-set.co	\N	\N	$2a$10$9fDg3CLfAqbEbOsqH/Us1.aQQaFLS6W0Zu9zovWf8lvGNLJ21oLai	9c987b76fb1d30d1fb672c109b23b85554d9c6aa46951e7c074c8c6c912a8192	2024-11-26 21:21:23.038	admin	\N	\N	+63 9497070741	\N	Sanasa St.		Davao City	Philippines	80000	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-11-25 21:21:23.038+00	2024-11-26 15:55:50.724+00	f
cm3yym2bd000010t4ljfvz2kc	\N	Bon Gonzales	bon@ready-set.co	\N	\N	$2a$10$0DUMlOwmoWdxwUEyndVGPODeDhLIk6IMHDwb9jtDrF.N5FICPUtEe	6d4a950047ac20362428ad23ba8312d8f121a5c81b3eeb8df3b7a80aa43669dc	2024-11-27 21:19:03.47	helpdesk	\N	\N	4152266872		Agabus Street		Dala City	California	94014	\N					\N		\N	active	\N	\N	\N	2024-11-26 21:19:03.47+00	2024-12-16 16:01:06.859+00	t
cm2vcik0o00001276nfupzx52	\N	Jose Sanchez 	jsanchez.riman@icloud.com	\N	\N	$2a$10$gdt/oGLQ2Z038WAhlQnM/ufXjZZ8h0wQm8n.oRMOdKJCQHDEYDTYG	9babafb70975a9692892141022903d9c15291b6b5737d125a7b280ba06550a69	2024-10-31 03:57:27.383	driver	\N	\N	415-214-4970	\N	33 8th St	1704	San Francisco	CA	94103	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2024-10-30 03:57:27.383+00	2024-12-10 18:12:13.103+00	t
cm407k5a4000034gtqi97ttn6	\N	Mai Vallejo-Yap	mai@ready-set.com	\N	\N	$2a$10$d1DjRgS/EAlyBXi6vCEVIupHRwRNnehvWqqo4NS.z368ljfdk/l3C	d553141b4364e966eb351ab25b5ed828784df391987df7149a3dd624377c0ca8	2024-11-28 18:17:16.73	vendor	RS-Test	\N	+63 9497070741		Sanasa St		Davao CIty	Philippines	8000	\N		Alameda	Breakfast	Foodee	1-5 per week	Utensils	\N	active	\N	\N	\N	2024-11-27 18:17:16.73+00	2024-12-16 16:00:37.494+00	t
cm2q9pj4j0000m95sb6fqm567	\N	Gerome Rogers	missalexsito@gmail.com	\N	\N	$2a$10$YtFsJ1dNWT24ChDgqVMF1.zV4UM7PRFELPV4DD1yGxT.kgGzOUNTS	fe0e1c28bc706542562e8cbb8e22a3349e51626ce4f385e529397c5ad69540db	2024-10-27 14:40:03.089	driver	\N	\N	2028197833	\N	2660 Royal Ann dr		Union City	CA	94587	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2024-10-26 14:40:03.089+00	2024-12-10 18:11:54.838+00	t
cm4d2x9xy0000bjtxb71cwwf9	\N	Vendor	vendordummy@gmail.com	\N	\N	$2a$10$7MHBDaFLgq4YQxgKwylST.LgHwxx1W8FDLCCGcHZK1tEPX27u1MF6	\N	\N	vendor	Vendordummy	\N	(415) 823-3305	https://vendordummy.com	595 Alabama St, 		San Francisco	United States	94110	\N	Yes	San Francisco, San Mateo	Breakfast, Lunch, Dinner	Foodee, Cater Cow, Ez Cater	6-15 per week	Napkins, Labels	\N	active	\N	\N	\N	2024-12-06 18:28:31.509+00	2024-12-16 16:01:31.449+00	f
cm4d1ctys0000lqgv4yzimj95	\N	Andrea Fetalyn	andrea@ready-set.co	\N	\N	$2a$10$Kwr.tT/41PC4dlCG7HxCgerLhXf9o0ESAaNDYkpvnwZm72LZFaVX.	\N	\N	client	Andrea Gwapa	\N	12345678		103 Horne Avenue, San Francisco, CA, 		Daly	California	94124	\N		San Francisco	Lunch	\N	1-5 per week	\N	1-24	active	\N	\N	\N	2024-12-06 17:44:38.067+00	2024-12-16 16:02:00.605+00	f
cm4ir4ljx0000562z3htnuy0a	\N	Mai Vallejo-Yap	iammai0409@gmail.com	\N	\N	$2a$10$Z88Lh7JipfnF7LlJAH8TmOaWuF95CAWH5dKnmAmNHx4nCz5Yjev0W	\N	\N	driver	\N	\N	+63 9497070741	\N	Sanasa St		Davao CIty	Philippines	8000	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-12-10 17:44:54.811+00	2024-12-16 16:02:12.225+00	f
cm3tvokg200008cln9d5j05xf	\N	Mahesh	j.mahesh1388@gmail.com	\N	\N	$2a$10$Y8ALolEEBUeNZm/J9Uq9W.WtR22eIliRcMSxamnxhBMXzMDxh06K6	\N	\N	driver	\N	\N	4086009153	\N	620 Iris Ave	432	Sunnyvale	CA	94086	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-11-23 07:58:10.561+00	2024-12-20 19:24:25.492+00	f
cm1ozjqe90000my9clp6ntsmy	\N	Honey Bagay	honey@ready-set.co	\N	\N	$2a$10$H66sJ2CkR7p.Y2A1cYKQw.JvVkRtowr1sMP.7JS7hOd79M0X4JGXK	\N	\N	super_admin	\N	\N	+639364572029	\N	Purok 7	Bongabong	Pantukan	Davao De Oro	8809	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-09-30 12:28:07.904+00	2024-12-10 17:04:54.004+00	f
cm4itthva00001wzjge3dfyln	\N	Lezylane Andig	lezylane@ready-set.co	\N	\N	$2a$10$Lkbhhc291D/smtwHLskS8uKZfVPp5DnqnZ.yTL3W.0cigr2d6FEQ2	95ec2fad2b89067e19e6ef6aa1261b99089ece09	2024-12-10 19:34:53.482	admin	\N	\N	+639178913415	\N	San Victores St.	Barangay 9, Purok 1	Malaybalay City	Bukidnon	8700	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-12-10 19:00:15.668+00	2024-12-10 19:24:53.483+00	f
cm405b3ix0000icpl180rrsb3	\N	Mai Vallejo-Yap	chelledah@ready-set.co	\N	\N	$2a$10$HOvosrBb5/FZcQK2wqXHzO6qgZtwZlA7QRRdAwwFmbLcoN/GVmLm.	a11c161321a9f4208eb614e20dbd58a8b480428bd37b014641df381c155e27fa	2024-11-28 17:14:15.319	vendor	RS-Test		+63 9497070741		Sanasa St		Davao CIty	Philippines	94010			Santa Clara	Dinner	Zero Cater	6-15 per week	Place Settings		active	\N	\N	\N	2024-11-27 17:14:15.319+00	2024-12-16 16:01:50.191+00	f
cm5psyzdk0000js03ngzaqmmc	\N	April Ducao	aprild963@gmail.com	\N	\N	$2a$10$eWu9SOJdhLltxaEPnKdIu.7DHmuFKfLb0V7w6xx0Kmzh.sIEksAHG	\N	\N	helpdesk	\N	\N	+639171385390	\N	DDF Village 		Davao 	Philippines	8000	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2025-01-09 20:50:37.582+00	2025-01-09 20:50:37.582+00	f
\.


--
-- Data for Name: userAddress; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."userAddress" (id, "userId", "addressId", alias, "isDefault", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: verification_token; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.verification_token (id, identifier, token, expires) FROM stdin;
\.


--
-- Name: catering_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.catering_request_id_seq', 77, true);


--
-- Name: on_demand_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.on_demand_id_seq', 37, true);


--
-- Name: FormSubmission FormSubmission_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."FormSubmission"
    ADD CONSTRAINT "FormSubmission_pkey" PRIMARY KEY (id);


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
-- Name: file_upload file_upload_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.file_upload
    ADD CONSTRAINT file_upload_pkey PRIMARY KEY (id);


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
-- Name: userAddress userAddress_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."userAddress"
    ADD CONSTRAINT "userAddress_pkey" PRIMARY KEY (id);


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
-- Name: FormSubmission_createdAt_idx; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "FormSubmission_createdAt_idx" ON public."FormSubmission" USING btree ("createdAt");


--
-- Name: FormSubmission_formType_idx; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "FormSubmission_formType_idx" ON public."FormSubmission" USING btree ("formType");


--
-- Name: FormSubmission_syncedToSheets_idx; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "FormSubmission_syncedToSheets_idx" ON public."FormSubmission" USING btree ("syncedToSheets");


--
-- Name: account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON public.account USING btree (provider, "providerAccountId");


--
-- Name: catering_request_order_number_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX catering_request_order_number_key ON public.catering_request USING btree (order_number);


--
-- Name: file_upload_entityType_entityId_idx; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "file_upload_entityType_entityId_idx" ON public.file_upload USING btree ("entityType", "entityId");


--
-- Name: on_demand_order_number_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX on_demand_order_number_key ON public.on_demand USING btree (order_number);


--
-- Name: session_sessionToken_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "session_sessionToken_key" ON public.session USING btree ("sessionToken");


--
-- Name: userAddress_userId_addressId_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "userAddress_userId_addressId_key" ON public."userAddress" USING btree ("userId", "addressId");


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
-- Name: FormSubmission FormSubmission_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."FormSubmission"
    ADD CONSTRAINT "FormSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: account account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: address address_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT "address_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;


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
    ADD CONSTRAINT catering_request_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


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
-- Name: file_upload file_upload_cateringRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.file_upload
    ADD CONSTRAINT "file_upload_cateringRequestId_fkey" FOREIGN KEY ("cateringRequestId") REFERENCES public.catering_request(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: file_upload file_upload_onDemandId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.file_upload
    ADD CONSTRAINT "file_upload_onDemandId_fkey" FOREIGN KEY ("onDemandId") REFERENCES public.on_demand(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: file_upload file_upload_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.file_upload
    ADD CONSTRAINT "file_upload_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: on_demand on_demand_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.on_demand
    ADD CONSTRAINT on_demand_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.address(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: on_demand on_demand_delivery_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.on_demand
    ADD CONSTRAINT on_demand_delivery_address_id_fkey FOREIGN KEY (delivery_address_id) REFERENCES public.address(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: on_demand on_demand_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.on_demand
    ADD CONSTRAINT on_demand_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: userAddress userAddress_addressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."userAddress"
    ADD CONSTRAINT "userAddress_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES public.address(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: userAddress userAddress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."userAddress"
    ADD CONSTRAINT "userAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: default
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

