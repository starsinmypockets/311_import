--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.6
-- Dumped by pg_dump version 9.6.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: _philly311_1; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE _philly311_1 (
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
    id integer,
    created_at date,
    updated_at date
);


ALTER TABLE _philly311_1 OWNER TO postgres;

--
-- Name: philly_311; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE philly_311 (
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


ALTER TABLE philly_311 OWNER TO postgres;

--
-- Name: philly_311_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE philly_311_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE philly_311_id_seq OWNER TO postgres;

--
-- Name: philly_311_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE philly_311_id_seq OWNED BY philly_311.id;


--
-- Name: philly_311 id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY philly_311 ALTER COLUMN id SET DEFAULT nextval('philly_311_id_seq'::regclass);


--
-- Name: philly_311 philly_311_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY philly_311
    ADD CONSTRAINT philly_311_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

