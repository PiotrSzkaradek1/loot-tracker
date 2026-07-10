--
-- PostgreSQL database dump
--

\restrict iqgBBq9XoNezTwOENX6HzruajhmYqWvPpqzlZHmj1RrsdeOyuYQWE4HTD8vzPDI

-- Dumped from database version 17.7 (Debian 17.7-3.pgdg13+1)
-- Dumped by pg_dump version 17.7 (Debian 17.7-3.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: difficulty_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.difficulty_enum AS ENUM (
    'easy',
    'normal',
    'hard'
);


ALTER TYPE public.difficulty_enum OWNER TO postgres;

--
-- Name: drifs_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.drifs_enum AS ENUM (
    'amad',
    'ann',
    'eras',
    'err',
    'lun',
    'verd',
    'von',
    'elen',
    'grod',
    'grud',
    'tall',
    'tovi',
    'alorn',
    'faln',
    'farid',
    'holm',
    'iori',
    'jorn',
    'abaf',
    'astah',
    'band',
    'kalh',
    'teld',
    'unn',
    'val',
    'dur',
    'ling',
    'lorb',
    'oda',
    'ulk'
);


ALTER TYPE public.drifs_enum OWNER TO postgres;

--
-- Name: profession_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.profession_enum AS ENUM (
    'mag ognia',
    'voodoo',
    'druid',
    'sheed',
    'łucznik',
    'rycerz',
    'barbarzyńca'
);


ALTER TYPE public.profession_enum OWNER TO postgres;

--
-- Name: server_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.server_enum AS ENUM (
    'Thanar',
    'Veskara',
    'Vardis'
);


ALTER TYPE public.server_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: boss_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.boss_items (
    boss_id integer NOT NULL,
    item_id integer NOT NULL
);


ALTER TABLE public.boss_items OWNER TO postgres;

--
-- Name: bosses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bosses (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    tier integer DEFAULT 3 NOT NULL,
    min_syng integer DEFAULT 2 NOT NULL,
    max_syng integer DEFAULT 2 NOT NULL,
    dungeon_id integer,
    CONSTRAINT bosses_tier_check CHECK (((tier >= 1) AND (tier <= 4)))
);


ALTER TABLE public.bosses OWNER TO postgres;

--
-- Name: bosses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bosses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bosses_id_seq OWNER TO postgres;

--
-- Name: bosses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bosses_id_seq OWNED BY public.bosses.id;


--
-- Name: characters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.characters (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name character varying(50) NOT NULL,
    level integer NOT NULL,
    profession character varying NOT NULL,
    server character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT characters_level_check CHECK (((level >= 1) AND (level <= 140)))
);


ALTER TABLE public.characters OWNER TO postgres;

--
-- Name: characters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.characters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.characters_id_seq OWNER TO postgres;

--
-- Name: characters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.characters_id_seq OWNED BY public.characters.id;


--
-- Name: drifs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.drifs (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.drifs OWNER TO postgres;

--
-- Name: drifs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.drifs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.drifs_id_seq OWNER TO postgres;

--
-- Name: drifs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.drifs_id_seq OWNED BY public.drifs.id;


--
-- Name: dungeons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dungeons (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    has_easy boolean DEFAULT false,
    has_normal boolean DEFAULT true,
    has_hard boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.dungeons OWNER TO postgres;

--
-- Name: dungeons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dungeons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dungeons_id_seq OWNER TO postgres;

--
-- Name: dungeons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dungeons_id_seq OWNED BY public.dungeons.id;


--
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.items OWNER TO postgres;

--
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_id_seq OWNER TO postgres;

--
-- Name: items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.items_id_seq OWNED BY public.items.id;


--
-- Name: rars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rars (
    id integer NOT NULL,
    boss_id integer NOT NULL,
    name character varying(100) NOT NULL,
    tier integer NOT NULL,
    CONSTRAINT rars_tier_check CHECK (((tier >= 1) AND (tier <= 4)))
);


ALTER TABLE public.rars OWNER TO postgres;

--
-- Name: rars_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rars_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rars_id_seq OWNER TO postgres;

--
-- Name: rars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rars_id_seq OWNED BY public.rars.id;


--
-- Name: record_drifs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.record_drifs (
    record_id integer NOT NULL,
    drif_id integer NOT NULL,
    tier integer NOT NULL,
    CONSTRAINT record_drifs_tier_check CHECK (((tier >= 1) AND (tier <= 4)))
);


ALTER TABLE public.record_drifs OWNER TO postgres;

--
-- Name: record_gold; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.record_gold (
    record_id integer NOT NULL,
    amount integer NOT NULL,
    CONSTRAINT record_gold_amount_check CHECK ((amount >= 0))
);


ALTER TABLE public.record_gold OWNER TO postgres;

--
-- Name: record_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.record_items (
    record_id integer NOT NULL,
    item_id integer NOT NULL,
    amount integer NOT NULL,
    CONSTRAINT record_items_amount_check CHECK ((amount > 0))
);


ALTER TABLE public.record_items OWNER TO postgres;

--
-- Name: record_rars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.record_rars (
    record_id integer NOT NULL,
    rar_id integer NOT NULL,
    quality integer NOT NULL,
    CONSTRAINT record_rars_quality_check CHECK (((quality >= 1) AND (quality <= 9)))
);


ALTER TABLE public.record_rars OWNER TO postgres;

--
-- Name: record_synergetics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.record_synergetics (
    record_id integer NOT NULL,
    tier integer NOT NULL,
    CONSTRAINT record_synergetics_tier_check CHECK (((tier >= 2) AND (tier <= 14)))
);


ALTER TABLE public.record_synergetics OWNER TO postgres;

--
-- Name: record_tracks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.record_tracks (
    record_id integer NOT NULL,
    amount integer NOT NULL,
    CONSTRAINT record_trops_amount_check CHECK ((amount > 0))
);


ALTER TABLE public.record_tracks OWNER TO postgres;

--
-- Name: records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.records (
    id integer NOT NULL,
    character_id integer NOT NULL,
    boss_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    difficulty character varying(50) DEFAULT 'normal'::character varying NOT NULL
);


ALTER TABLE public.records OWNER TO postgres;

--
-- Name: records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.records_id_seq OWNER TO postgres;

--
-- Name: records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.records_id_seq OWNED BY public.records.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    role character varying(20) DEFAULT 'USER'::character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: bosses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bosses ALTER COLUMN id SET DEFAULT nextval('public.bosses_id_seq'::regclass);


--
-- Name: characters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.characters ALTER COLUMN id SET DEFAULT nextval('public.characters_id_seq'::regclass);


--
-- Name: drifs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drifs ALTER COLUMN id SET DEFAULT nextval('public.drifs_id_seq'::regclass);


--
-- Name: dungeons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dungeons ALTER COLUMN id SET DEFAULT nextval('public.dungeons_id_seq'::regclass);


--
-- Name: items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.items_id_seq'::regclass);


--
-- Name: rars id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rars ALTER COLUMN id SET DEFAULT nextval('public.rars_id_seq'::regclass);


--
-- Name: records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.records ALTER COLUMN id SET DEFAULT nextval('public.records_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: boss_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.boss_items (boss_id, item_id) FROM stdin;
5	4
5	5
5	6
5	7
5	8
6	4
6	5
6	6
6	7
1	1
2	1
4	1
1	2
3	2
4	2
2	3
3	3
4	3
6	8
\.


--
-- Data for Name: bosses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bosses (id, name, tier, min_syng, max_syng, dungeon_id) FROM stdin;
1	Ivravul	3	2	5	1
2	Jaskółka	3	3	8	2
3	Konstrukt	3	3	8	4
4	Admirał Utoru	4	8	11	3
5	Mahet	4	8	11	5
6	Tarul	4	8	11	5
\.


--
-- Data for Name: characters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.characters (id, user_id, name, level, profession, server, created_at) FROM stdin;
1	1	debil	16	Rycerz	Veskara	2026-05-22 15:54:33.134071
33	23	Ziomek	123	Rycerz	Thanar	2026-05-26 18:10:23.671517
34	23	ChceToZdac	3	Mag Ognia	Thanar	2026-05-30 08:30:27.786677
14	2	ProRycKox	140	Rycerz	Thanar	2025-09-06 21:10:49.979766
15	2	Grzesiooo	123	Rycerz	Vardis	2025-09-06 21:12:14.051777
16	2	xxxprodrxxx	140	Druid	Thanar	2025-09-07 20:35:23.32097
17	3	asd	123	Druid	Thanar	2025-09-07 21:01:42.080917
18	20	Ciastek	140	Druid	Vardis	2026-01-15 13:24:59.332439
19	20	Janek	14	Rycerz	Thanar	2026-01-15 17:09:55.715884
21	20	Kremuwka	140	Rycerz	Var	2026-01-28 17:28:25.996924
27	20	bub	123	Rycerz	bub	2026-01-28 17:28:52.664996
29	20	asd	140	Rycerz	asd	2026-01-28 19:53:07.149987
30	20	ziemniaczek	123	Rycerz	Thanar	2026-02-04 12:51:40.859799
31	20	Historyk	65	Druid	Thanar	2026-02-05 23:00:38.824278
32	22	Piotr	140	Rycerz	Thanar	2026-02-08 09:26:47.812101
\.


--
-- Data for Name: drifs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.drifs (id, name) FROM stdin;
1	amad
2	ann
3	eras
4	err
5	lun
6	verd
7	von
8	elen
9	grod
10	grud
11	tall
12	tovi
13	alorn
14	faln
15	farid
16	holm
17	iori
18	jorn
19	abaf
20	astah
21	band
22	kalh
23	teld
24	unn
25	val
26	dur
27	ling
28	lorb
29	oda
30	ulk
\.


--
-- Data for Name: dungeons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dungeons (id, name, has_easy, has_normal, has_hard, created_at) FROM stdin;
1	Miasto Ivravula	f	t	t	2026-05-27 09:07:39.146966
2	Gniazdo Jaskółki	t	t	t	2026-05-27 09:07:39.146966
3	Statek Admirała	f	t	t	2026-05-27 09:07:39.146966
4	Magazyn Konstrukta	t	t	t	2026-05-27 09:07:39.146966
5	Miasto Tarula	f	t	t	2026-05-27 11:57:22.358823
\.


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (id, name) FROM stdin;
1	Glif Bakalarski
2	Dielektryk
3	Esencja
4	Vorliński dukat
5	Inhibitor diamentowy
6	Inhibitor platynowy
7	Reol
8	Dvigg
\.


--
-- Data for Name: rars; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rars (id, boss_id, name, tier) FROM stdin;
1	1	Nadzieja Pokoleń	3
2	1	Powrót Ivravula	3
4	1	Władca losu	3
5	1	Zemsta Ivravula	3
6	2	Fanga	3
7	2	Griv	3
8	2	Vogurun	3
9	2	Yurugu	3
10	2	Zadry	3
11	3	Harttraum	3
12	3	Otwieracz	3
13	3	Sigil	3
14	4	Admiralski Gronostaj	4
15	4	Inavoxy	4
16	4	Kil	4
17	4	Szpony Seimhi	4
18	4	Takerony	4
19	4	Trójząb admiralski	4
20	5	Arhauty	4
21	5	Dorbis	4
22	5	Ortasis	4
23	5	Temary	4
24	6	Cień Tarula	4
25	6	Salmurn	4
26	6	Zalla	4
27	6	Ziraki	4
\.


--
-- Data for Name: record_drifs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.record_drifs (record_id, drif_id, tier) FROM stdin;
1	19	1
3	19	1
4	21	1
\.


--
-- Data for Name: record_gold; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.record_gold (record_id, amount) FROM stdin;
1	200000
3	1000
4	1
5	100000
6	250000
7	8989
8	100000
10	100000
11	1000
12	100000
13	150000
\.


--
-- Data for Name: record_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.record_items (record_id, item_id, amount) FROM stdin;
1	1	2
1	2	2
3	1	1
3	2	1
5	4	100
5	7	3
6	5	3
6	6	2
7	4	99
7	5	9
7	6	9
7	7	9
7	8	9
8	4	100
8	5	3
10	6	2
11	7	3
11	8	3
12	4	100
12	5	3
12	6	2
12	7	3
12	8	3
13	4	200
13	5	6
13	7	3
13	8	3
\.


--
-- Data for Name: record_rars; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.record_rars (record_id, rar_id, quality) FROM stdin;
1	1	1
3	1	1
5	20	1
6	25	1
13	20	1
\.


--
-- Data for Name: record_synergetics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.record_synergetics (record_id, tier) FROM stdin;
1	2
3	2
\.


--
-- Data for Name: record_tracks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.record_tracks (record_id, amount) FROM stdin;
3	1
5	2
6	4
7	9
8	1
10	2
11	3
12	8
13	55
\.


--
-- Data for Name: records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.records (id, character_id, boss_id, created_at, difficulty) FROM stdin;
1	33	1	2026-05-27 07:21:22.410683	Hard
3	33	1	2026-05-27 07:40:55.244749	Normal
4	33	1	2026-05-27 07:41:46.343985	Normal
5	33	5	2026-05-27 13:00:30.926611	Normal
6	33	6	2026-05-27 13:01:47.72681	Normal
7	33	6	2026-05-27 13:04:59.829423	Normal
8	33	6	2026-05-29 11:52:17.969839	Hard
9	33	6	2026-05-29 11:52:23.074635	Hard
10	33	6	2026-05-29 11:52:30.483209	Hard
11	33	5	2026-05-29 11:53:22.121138	Hard
12	34	5	2026-05-30 08:33:03.09989	Hard
13	34	5	2026-05-30 08:33:22.860268	Hard
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, created_at, role) FROM stdin;
1	chuj@chuj	$2b$10$oUM89MdP478pYXrR4XxOn.LFMYMhxOQbvjaYs2AUhhjp4mJcHYtHC	2026-05-22 15:54:10.509774	user
2	piotr@gmail.com	$2y$10$wGKk9Ae57QpFk57aZS0.IelmtA/lWQZR34vWsKoxyB1/Ca5P0MdlC	2025-09-05 18:13:13.64953	USER
3	wika@gmail.com	$2y$10$BD2J/u3QElxatggVmZMOlOCicSpLNVCy207uqe6t0N3axQqP2tNFy	2025-09-05 18:37:12.729638	USER
4	mati@gmail.com	$2y$10$YQaoWk7RPqrvYDYjIPuL7eVB0LxjFEfof8i1t5g3mqmTF8VJTNcKm	2025-09-05 21:17:40.226417	USER
5	wujek@gmail.com	$2y$10$3CJ29jl3g3XoFb1zFO6xWOG88eLBVuHEByqUNh2tkwrqy/HEmxqka	2025-09-05 21:42:16.034917	USER
6	cc@gmail.com	$2y$10$i5AzYrEFsQPLsNs93GCHdur3P1wFhLOCpzOkOQPAEbmXzalUjvh9C	2025-09-05 21:48:44.813834	USER
8	aa@gmail.com	$2y$10$DOWRFLjDsZfoVIBBcG9WguSAa2G7gL8RkO4X1cbrPBTri7sgoCdMu	2025-09-05 22:34:12.757642	USER
9	rcrc@gmail.com	$2y$10$0Kym6cMitL3UcEH8Pl1P8e5Wbgm22ZzW5EvuL5OuL/Qrbar3YLCJ2	2025-09-05 23:27:55.373438	USER
10	amen@gmail.com	$2y$10$r.414YRhxBziBrOnZ6s5le3c9PTg4LNpiqqyxDuSXHhRhAH/Lizai	2025-09-05 23:39:18.075885	USER
14	admin@example.com	$2b$10$ZvcI6KcqeUsWGx1c.XcCq.SVEDPMLCF51IaIsfyrOc4DYCKoaOo/y	2025-11-24 22:44:23.258534	ADMIN
15	jaja@aa	$2b$10$Z2Sbgw4PmmMhSZMNdRIm6.HgIpCOK9yHcQL2rV6Xw.OnzPjMzmC7C	2026-01-13 02:25:18.358491	user
16	jaja@aa	$2b$10$sdvgCg5/5PxCDqtLKWHl1.lp0D8EzerFs/FpDAnxWxE19BTJ4sO5m	2026-01-13 16:47:29.742342	user
17	jaja@aa	$2b$10$s/7A/tEwmT93Do7duEPRT.kU/047MIsMfhBYetLo4x3ghY5DOumH2	2026-01-13 16:47:34.780464	user
18	jaja@aaaa	$2b$10$4OvwHVKPHBeJcx8Kw8PJd.RGntS2WVobUc/hk7Ayh4wdBrKcF2bwy	2026-01-13 21:15:06.390045	user
19	jan@usz	$2b$10$DHjp5tt51pYzpclJZMXvAuF49Ffre5NGl5KltdmesbaojCsvPmLwe	2026-01-13 23:51:00.05653	user
20	dupa@dupa	$2b$10$Bl2qN72wFGoKLAafW1lG9eIvgi0qtI50a.xRupIyndu5CFATvmWdu	2026-01-14 16:37:44.954837	user
21	zptai@ztpai	$2b$10$6fViFMvUpShkXWMhdzgeT.0bpGhg8p4fpYnC5PMfv0PjKCGdsPbhy	2026-02-08 09:25:30.778648	user
22	piotr@piotr	$2b$10$m2JBbGtf4Nkl3zak6DDw7OllOVytmGvEh/sY.Z5JFoFmbehy4CxBm	2026-02-08 09:25:55.960192	user
23	vue@vue.com	$2b$10$jRoRHu6SThyixrndLBBMNuMG5E2ND57/wJg1wo7o78q1A7S04quzK	2026-05-25 09:32:46.414633	user
\.


--
-- Name: bosses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bosses_id_seq', 6, true);


--
-- Name: characters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.characters_id_seq', 34, true);


--
-- Name: drifs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.drifs_id_seq', 30, true);


--
-- Name: dungeons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dungeons_id_seq', 5, true);


--
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_id_seq', 8, true);


--
-- Name: rars_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rars_id_seq', 27, true);


--
-- Name: records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.records_id_seq', 13, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 23, true);


--
-- Name: boss_items boss_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boss_items
    ADD CONSTRAINT boss_items_pkey PRIMARY KEY (boss_id, item_id);


--
-- Name: bosses bosses_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bosses
    ADD CONSTRAINT bosses_name_key UNIQUE (name);


--
-- Name: bosses bosses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bosses
    ADD CONSTRAINT bosses_pkey PRIMARY KEY (id);


--
-- Name: characters characters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_pkey PRIMARY KEY (id);


--
-- Name: drifs drifs_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drifs
    ADD CONSTRAINT drifs_name_key UNIQUE (name);


--
-- Name: drifs drifs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drifs
    ADD CONSTRAINT drifs_pkey PRIMARY KEY (id);


--
-- Name: dungeons dungeons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dungeons
    ADD CONSTRAINT dungeons_pkey PRIMARY KEY (id);


--
-- Name: items items_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_name_key UNIQUE (name);


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- Name: rars rars_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rars
    ADD CONSTRAINT rars_pkey PRIMARY KEY (id);


--
-- Name: record_drifs record_drifs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.record_drifs
    ADD CONSTRAINT record_drifs_pkey PRIMARY KEY (record_id, drif_id);


--
-- Name: record_gold record_gold_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.record_gold
    ADD CONSTRAINT record_gold_pkey PRIMARY KEY (record_id);


--
-- Name: record_items record_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.record_items
    ADD CONSTRAINT record_items_pkey PRIMARY KEY (record_id, item_id);


--
-- Name: record_rars record_rars_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.record_rars
    ADD CONSTRAINT record_rars_pkey PRIMARY KEY (record_id, rar_id);


--
-- Name: record_synergetics record_synergetics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.record_synergetics
    ADD CONSTRAINT record_synergetics_pkey PRIMARY KEY (record_id, tier);


--
-- Name: records records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.records
    ADD CONSTRAINT records_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: boss_items boss_items_boss_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boss_items
    ADD CONSTRAINT boss_items_boss_id_fkey FOREIGN KEY (boss_id) REFERENCES public.bosses(id) ON DELETE CASCADE;


--
-- Name: boss_items boss_items_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boss_items
    ADD CONSTRAINT boss_items_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id) ON DELETE CASCADE;


--
-- Name: bosses bosses_dungeon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bosses
    ADD CONSTRAINT bosses_dungeon_id_fkey FOREIGN KEY (dungeon_id) REFERENCES public.dungeons(id) ON DELETE SET NULL;


--
-- Name: characters characters_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: rars rars_boss_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rars
    ADD CONSTRAINT rars_boss_id_fkey FOREIGN KEY (boss_id) REFERENCES public.bosses(id) ON DELETE CASCADE;


--
-- Name: record_drifs record_drifs_drif_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.record_drifs
    ADD CONSTRAINT record_drifs_drif_id_fkey FOREIGN KEY (drif_id) REFERENCES public.drifs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: record_drifs record_drifs_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.record_drifs
    ADD CONSTRAINT record_drifs_record_id_fkey FOREIGN KEY (record_id) REFERENCES public.records(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: record_gold record_gold_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.record_gold
    ADD CONSTRAINT record_gold_record_id_fkey FOREIGN KEY (record_id) REFERENCES public.records(id) ON DELETE CASCADE;


--
-- Name: record_items record_items_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.record_items
    ADD CONSTRAINT record_items_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id) ON DELETE CASCADE;


--
-- Name: record_items record_items_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.record_items
    ADD CONSTRAINT record_items_record_id_fkey FOREIGN KEY (record_id) REFERENCES public.records(id) ON DELETE CASCADE;


--
-- Name: record_rars record_rars_rar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.record_rars
    ADD CONSTRAINT record_rars_rar_id_fkey FOREIGN KEY (rar_id) REFERENCES public.rars(id) ON DELETE CASCADE;


--
-- Name: record_rars record_rars_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.record_rars
    ADD CONSTRAINT record_rars_record_id_fkey FOREIGN KEY (record_id) REFERENCES public.records(id) ON DELETE CASCADE;


--
-- Name: record_synergetics record_synergetics_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.record_synergetics
    ADD CONSTRAINT record_synergetics_record_id_fkey FOREIGN KEY (record_id) REFERENCES public.records(id) ON DELETE CASCADE;


--
-- Name: record_tracks record_trops_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.record_tracks
    ADD CONSTRAINT record_trops_record_id_fkey FOREIGN KEY (record_id) REFERENCES public.records(id) ON DELETE CASCADE;


--
-- Name: records records_boss_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.records
    ADD CONSTRAINT records_boss_id_fkey FOREIGN KEY (boss_id) REFERENCES public.bosses(id) ON DELETE CASCADE;


--
-- Name: records records_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.records
    ADD CONSTRAINT records_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict iqgBBq9XoNezTwOENX6HzruajhmYqWvPpqzlZHmj1RrsdeOyuYQWE4HTD8vzPDI

