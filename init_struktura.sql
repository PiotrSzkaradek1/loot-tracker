--
-- PostgreSQL database dump
--

\restrict CKgjUc1aduEqZhEkMYg0hDwfpeeUlDNNYhWcPPK17bWfgAU3j5hNW6Hm2rb5AFO

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

\unrestrict CKgjUc1aduEqZhEkMYg0hDwfpeeUlDNNYhWcPPK17bWfgAU3j5hNW6Hm2rb5AFO

