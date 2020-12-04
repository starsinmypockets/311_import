--
-- PostgreSQL database dump
--

-- Dumped from database version 13.1 (Debian 13.1-1.pgdg90+1)
-- Dumped by pg_dump version 13.1 (Debian 13.1-1.pgdg90+1)

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
-- Name: import; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA import;


ALTER SCHEMA import OWNER TO postgres;

--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _2017_philly_311; Type: TABLE; Schema: import; Owner: postgres
--

CREATE TABLE import._2017_philly_311 (
    data json
);


ALTER TABLE import._2017_philly_311 OWNER TO postgres;

--
-- Name: _2017_philly_311_rows; Type: TABLE; Schema: import; Owner: postgres
--

CREATE TABLE import._2017_philly_311_rows (
    data json
);


ALTER TABLE import._2017_philly_311_rows OWNER TO postgres;

--
-- Name: test; Type: TABLE; Schema: import; Owner: postgres
--

CREATE TABLE import.test (
    data json
);


ALTER TABLE import.test OWNER TO postgres;

--
-- Name: neighb_counts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.neighb_counts (
    id integer NOT NULL,
    count integer,
    neighborhood character varying(40),
    service_name character varying(40),
    created_at date,
    updated_at date
);


ALTER TABLE public.neighb_counts OWNER TO postgres;

--
-- Name: neighb_counts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.neighb_counts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.neighb_counts_id_seq OWNER TO postgres;

--
-- Name: neighb_counts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.neighb_counts_id_seq OWNED BY public.neighb_counts.id;


--
-- Name: neighborhoods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.neighborhoods (
    id integer NOT NULL,
    root character varying(40),
    name character varying(40),
    listname character varying(40),
    mapname character varying(40),
    the_geometry public.geometry,
    created_at date,
    updated_at date
);


ALTER TABLE public.neighborhoods OWNER TO postgres;

--
-- Name: neighborhoods_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.neighborhoods_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.neighborhoods_id_seq OWNER TO postgres;

--
-- Name: neighborhoods_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.neighborhoods_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.neighborhoods_id_seq1 OWNER TO postgres;

--
-- Name: neighborhoods_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.neighborhoods_id_seq1 OWNED BY public.neighborhoods.id;


--
-- Name: philly_311; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.philly_311 (
    cartodb_id numeric,
    the_geom text,
    the_geom_webmercator text,
    objectid numeric,
    service_request_id numeric,
    status text,
    status_notes text,
    service_name text,
    service_code text,
    agency_responsible text,
    service_notice text,
    requested_datetime date,
    updated_datetime date,
    expected_datetime date,
    address text,
    zipcode text,
    media_url text,
    lat numeric,
    lon numeric,
    id integer NOT NULL,
    created_at date,
    updated_at date
);


ALTER TABLE public.philly_311 OWNER TO postgres;

--
-- Name: philly_311_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.philly_311_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.philly_311_id_seq OWNER TO postgres;

--
-- Name: philly_311_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.philly_311_id_seq OWNED BY public.philly_311.id;


--
-- Name: neighb_counts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.neighb_counts ALTER COLUMN id SET DEFAULT nextval('public.neighb_counts_id_seq'::regclass);


--
-- Name: neighborhoods id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.neighborhoods ALTER COLUMN id SET DEFAULT nextval('public.neighborhoods_id_seq1'::regclass);


--
-- Name: philly_311 id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.philly_311 ALTER COLUMN id SET DEFAULT nextval('public.philly_311_id_seq'::regclass);


--
-- Name: neighborhoods neighborhoods_listname_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.neighborhoods
    ADD CONSTRAINT neighborhoods_listname_key UNIQUE (listname);


--
-- Name: neighborhoods neighborhoods_mapname_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.neighborhoods
    ADD CONSTRAINT neighborhoods_mapname_key UNIQUE (mapname);


--
-- Name: neighborhoods neighborhoods_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.neighborhoods
    ADD CONSTRAINT neighborhoods_name_key UNIQUE (name);


--
-- Name: philly_311 philly_311_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.philly_311
    ADD CONSTRAINT philly_311_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

