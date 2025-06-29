--
-- PostgreSQL database dump
--

-- Dumped from database version 17.1
-- Dumped by pg_dump version 17.1

-- Started on 2025-06-29 15:18:34

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 240 (class 1259 OID 16683)
-- Name: announcements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.announcements (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    date_created date DEFAULT CURRENT_DATE
);


ALTER TABLE public.announcements OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16682)
-- Name: announcements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.announcements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.announcements_id_seq OWNER TO postgres;

--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 239
-- Name: announcements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.announcements_id_seq OWNED BY public.announcements.id;


--
-- TOC entry 236 (class 1259 OID 16634)
-- Name: assignment_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignment_submissions (
    id integer NOT NULL,
    assignment_id integer NOT NULL,
    student_id integer NOT NULL,
    file_name character varying(255),
    file_url text,
    is_on_time boolean DEFAULT true NOT NULL,
    late_duration character varying(50),
    grade integer,
    submitted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT assignment_submissions_grade_check CHECK (((grade >= 0) AND (grade <= 10)))
);


ALTER TABLE public.assignment_submissions OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16633)
-- Name: assignment_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assignment_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assignment_submissions_id_seq OWNER TO postgres;

--
-- TOC entry 5007 (class 0 OID 0)
-- Dependencies: 235
-- Name: assignment_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assignment_submissions_id_seq OWNED BY public.assignment_submissions.id;


--
-- TOC entry 232 (class 1259 OID 16598)
-- Name: assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignments (
    id integer NOT NULL,
    course_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    allowed_files text[],
    due_date date NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.assignments OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16597)
-- Name: assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assignments_id_seq OWNER TO postgres;

--
-- TOC entry 5008 (class 0 OID 0)
-- Dependencies: 231
-- Name: assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assignments_id_seq OWNED BY public.assignments.id;


--
-- TOC entry 220 (class 1259 OID 16438)
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    password character varying(255),
    color character varying(50),
    description text,
    creator_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16437)
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_id_seq OWNER TO postgres;

--
-- TOC entry 5009 (class 0 OID 0)
-- Dependencies: 219
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- TOC entry 234 (class 1259 OID 16613)
-- Name: grades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grades (
    id integer NOT NULL,
    quiz_id integer NOT NULL,
    student_id integer NOT NULL,
    correct_answers integer NOT NULL,
    grade numeric(3,1) DEFAULT 0,
    CONSTRAINT grades_grade_check CHECK (((grade >= (0)::numeric) AND (grade <= (10)::numeric)))
);


ALTER TABLE public.grades OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16612)
-- Name: grades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.grades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.grades_id_seq OWNER TO postgres;

--
-- TOC entry 5010 (class 0 OID 0)
-- Dependencies: 233
-- Name: grades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.grades_id_seq OWNED BY public.grades.id;


--
-- TOC entry 224 (class 1259 OID 16470)
-- Name: lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lessons (
    id integer NOT NULL,
    course_id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text,
    file_url text,
    created_at timestamp without time zone DEFAULT now(),
    description text
);


ALTER TABLE public.lessons OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16469)
-- Name: lessons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lessons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lessons_id_seq OWNER TO postgres;

--
-- TOC entry 5011 (class 0 OID 0)
-- Dependencies: 223
-- Name: lessons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lessons_id_seq OWNED BY public.lessons.id;


--
-- TOC entry 226 (class 1259 OID 16514)
-- Name: meetings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.meetings (
    id integer NOT NULL,
    course_id integer NOT NULL,
    title character varying(255) NOT NULL,
    meeting_link text NOT NULL,
    description text
);


ALTER TABLE public.meetings OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16513)
-- Name: meetings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.meetings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.meetings_id_seq OWNER TO postgres;

--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 225
-- Name: meetings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.meetings_id_seq OWNED BY public.meetings.id;


--
-- TOC entry 222 (class 1259 OID 16453)
-- Name: participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.participants (
    id integer NOT NULL,
    course_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.participants OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16452)
-- Name: participants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.participants_id_seq OWNER TO postgres;

--
-- TOC entry 5013 (class 0 OID 0)
-- Dependencies: 221
-- Name: participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.participants_id_seq OWNED BY public.participants.id;


--
-- TOC entry 230 (class 1259 OID 16584)
-- Name: quiz_questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quiz_questions (
    id integer NOT NULL,
    quiz_id integer NOT NULL,
    question_text text NOT NULL,
    options jsonb NOT NULL,
    correct_answer jsonb NOT NULL
);


ALTER TABLE public.quiz_questions OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16583)
-- Name: quiz_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quiz_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quiz_questions_id_seq OWNER TO postgres;

--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 229
-- Name: quiz_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quiz_questions_id_seq OWNED BY public.quiz_questions.id;


--
-- TOC entry 238 (class 1259 OID 16657)
-- Name: quiz_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quiz_results (
    id integer NOT NULL,
    quiz_id integer NOT NULL,
    user_id integer NOT NULL,
    correct_answers_count integer NOT NULL,
    grade numeric(5,2) NOT NULL
);


ALTER TABLE public.quiz_results OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16656)
-- Name: quiz_results_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quiz_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quiz_results_id_seq OWNER TO postgres;

--
-- TOC entry 5015 (class 0 OID 0)
-- Dependencies: 237
-- Name: quiz_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quiz_results_id_seq OWNED BY public.quiz_results.id;


--
-- TOC entry 228 (class 1259 OID 16569)
-- Name: quizzes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quizzes (
    id integer NOT NULL,
    course_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    timer integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.quizzes OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16568)
-- Name: quizzes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quizzes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quizzes_id_seq OWNER TO postgres;

--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 227
-- Name: quizzes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quizzes_id_seq OWNED BY public.quizzes.id;


--
-- TOC entry 242 (class 1259 OID 16724)
-- Name: requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requests (
    id integer NOT NULL,
    full_name character varying(100) NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) NOT NULL
);


ALTER TABLE public.requests OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16723)
-- Name: requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.requests_id_seq OWNER TO postgres;

--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 241
-- Name: requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.requests_id_seq OWNED BY public.requests.id;


--
-- TOC entry 218 (class 1259 OID 16415)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16414)
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
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4773 (class 2604 OID 16686)
-- Name: announcements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements ALTER COLUMN id SET DEFAULT nextval('public.announcements_id_seq'::regclass);


--
-- TOC entry 4769 (class 2604 OID 16637)
-- Name: assignment_submissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_submissions ALTER COLUMN id SET DEFAULT nextval('public.assignment_submissions_id_seq'::regclass);


--
-- TOC entry 4765 (class 2604 OID 16601)
-- Name: assignments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments ALTER COLUMN id SET DEFAULT nextval('public.assignments_id_seq'::regclass);


--
-- TOC entry 4756 (class 2604 OID 16441)
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- TOC entry 4767 (class 2604 OID 16616)
-- Name: grades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades ALTER COLUMN id SET DEFAULT nextval('public.grades_id_seq'::regclass);


--
-- TOC entry 4759 (class 2604 OID 16473)
-- Name: lessons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons ALTER COLUMN id SET DEFAULT nextval('public.lessons_id_seq'::regclass);


--
-- TOC entry 4761 (class 2604 OID 16517)
-- Name: meetings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meetings ALTER COLUMN id SET DEFAULT nextval('public.meetings_id_seq'::regclass);


--
-- TOC entry 4758 (class 2604 OID 16456)
-- Name: participants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants ALTER COLUMN id SET DEFAULT nextval('public.participants_id_seq'::regclass);


--
-- TOC entry 4764 (class 2604 OID 16587)
-- Name: quiz_questions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_questions ALTER COLUMN id SET DEFAULT nextval('public.quiz_questions_id_seq'::regclass);


--
-- TOC entry 4772 (class 2604 OID 16660)
-- Name: quiz_results id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_results ALTER COLUMN id SET DEFAULT nextval('public.quiz_results_id_seq'::regclass);


--
-- TOC entry 4762 (class 2604 OID 16572)
-- Name: quizzes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes ALTER COLUMN id SET DEFAULT nextval('public.quizzes_id_seq'::regclass);


--
-- TOC entry 4775 (class 2604 OID 16727)
-- Name: requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_id_seq'::regclass);


--
-- TOC entry 4755 (class 2604 OID 16418)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4998 (class 0 OID 16683)
-- Dependencies: 240
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.announcements (id, title, content, date_created) FROM stdin;
2	Test Announcement	Big break coming today!	2025-01-04
3	Big Announcement	This is a testing announcement to see if the function works, this will be deleted in a short time, so please ignore it if you see this. Thank you and Happy New Year!	2025-01-08
4	Final Call: Course Registration Closes Friday!	Don’t forget to enroll for next semester’s courses by March 15. Late submissions won’t be accepted. Check your academic advisor’s recommendations before selecting.	2025-04-23
5	Scheduled Maintenance – Platform Downtime	The LMS will be unavailable on March 20, 2:00 AM–6:00 AM for upgrades. Save your work in progress! Contact IT for urgent issues.	2025-04-23
6	Reminder: Midterm Paper Due Sunday!	Submit your 15-page paper on Global Trade Policies via Turnitin by 11:59 PM, March 17. Late submissions lose 10%/day.	2025-04-23
7	New Plagiarism Policy in Effect	Starting April 1, all assignments will use AI-detection tools. Violations lead to disciplinary action. Review the updated guidelines [here].	2025-04-23
8	Apply Now: Global Leadership Scholarship	Win $5,000 for your IR research! Submit essays by April 5.	2025-04-23
9	Model UN Conference – Sign Up Open!	Represent your country in our April 12–14 simulation. Register by March 30	2025-04-23
10	Campus Closed: Severe Weather Alert	Due to the storm, all classes are canceled on March 18. Stay safe! Check email for makeup schedules.	2025-04-23
\.


--
-- TOC entry 4994 (class 0 OID 16634)
-- Dependencies: 236
-- Data for Name: assignment_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assignment_submissions (id, assignment_id, student_id, file_name, file_url, is_on_time, late_duration, grade, submitted_at) FROM stdin;
\.


--
-- TOC entry 4990 (class 0 OID 16598)
-- Dependencies: 232
-- Data for Name: assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assignments (id, course_id, title, description, allowed_files, due_date, created_at) FROM stdin;
20	10	Policy Brief: Analyzing a Current Global Crisis	Students write a 1,200-word policy brief assessing a contemporary issue (e.g., Ukraine war, Taiwan tensions) using IR theories and proposing actionable solutions.	{pdf}	2028-06-22	2025-04-23 15:04:23.378384
23	4	Problem-Solving with Computational Thinking	Apply computational thinking (decomposition, pattern recognition, abstraction, algorithm design) to solve a simple problem	{pdf,docx}	2025-07-31	2025-06-29 14:28:30.952473
24	16	Artistic Period Showdown	Select one artwork each from the Renaissance and Modernist periods.\nCreate a 2-page PDF/DOCX addressing:\nTechniques (e.g., chiaroscuro vs. abstraction).\nCultural influences (e.g., religion vs. industrialization).\nPersonal preference with justification.	{pdf,docx}	2025-07-31	2025-06-29 14:36:38.377116
\.


--
-- TOC entry 4978 (class 0 OID 16438)
-- Dependencies: 220
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, title, password, color, description, creator_id, created_at) FROM stdin;
10	International Relations and Global Politics	12345	#22570a	Analyzes diplomacy, conflicts, and cooperation between nations.	11	2025-04-23 14:48:27.647864
11	Molecular Biology and Genetics	12345	#00ffb3	Study of DNA, genes, and cellular processes driving life.	12	2025-04-23 14:49:14.872579
12	 Machine Learning Fundamentals	12345	#2a3d50	Introduces AI concepts, models, and how machines learn from data.	13	2025-04-23 14:49:52.31415
13	Financial Accounting and Reporting	12345	#767a7f	Basics of financial statements, transactions, and corporate accounting standards.	14	2025-04-23 14:50:31.709065
15	Digital Illustration & Concept Art	12345	#18775a	Teaches digital tools (e.g., Photoshop, Procreate) to create characters, environments, and storytelling visuals.	4	2025-04-23 14:52:34.797696
16	Art History: Renaissance to Modernism	12345	#1d5341	Traces major movements (e.g., Baroque, Impressionism, Cubism)	4	2025-04-23 14:53:02.451846
17	Graphic Design & Visual Communication	12345	#ff004c	Focuses on typography, branding, and layout design for print and digital media.	4	2025-04-23 14:53:23.076226
18	Interactive Media & Game Design	12345	#027920	Combines art and technology to create immersive experiences, including 2D/3D game assets and UI design.	4	2025-04-23 14:53:44.746403
4	Computational Thinking & Problem Solving\n\n	12345	#6b7f94	Learn to break down complex problems, design efficient solutions, and think like a computer scientist	4	2024-12-09 14:51:52.534991
14	Introduction to Fine Arts	12345	#a600ff	Covers painting, sculpture, and drawing techniques, exploring historical and contemporary styles.	4	2025-04-23 14:52:15.100079
\.


--
-- TOC entry 4992 (class 0 OID 16613)
-- Dependencies: 234
-- Data for Name: grades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grades (id, quiz_id, student_id, correct_answers, grade) FROM stdin;
\.


--
-- TOC entry 4982 (class 0 OID 16470)
-- Dependencies: 224
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lessons (id, course_id, title, content, file_url, created_at, description) FROM stdin;
22	4	Introduction to Computational Thinking	\N	/backend/uploads/Wing06-ct.pdf	2025-06-29 14:21:32.967805	Learn the basics of computational thinking, including decomposition, pattern recognition, abstraction, and algorithm design, to solve problems efficiently.
23	18	Fundamentals of Game Design	\N	/backend/uploads/SC_Curriculum_Teacher_Guide.pdf	2025-06-29 14:30:21.53553	Explore core game design principles including mechanics, dynamics, aesthetics (MDA framework), and player psychology. Learn to prototype simple game concepts using industry-standard tools.
24	18	Interactive Media Development	\N	/backend/uploads/139149-interactive-media-production.pdf	2025-06-29 14:31:28.56187	Master the creation of interactive digital experiences through UI/UX design, branching narratives, and basic scripting for web/mobile applications. Includes hands-on work with Unity or Twine.
25	17	Principles of Visual Communication	\N	/backend/uploads/vc_basic_principles.pdf	2025-06-29 14:32:46.70857	Explore core design principles (contrast, alignment, hierarchy, color theory) and their application in creating effective visual messages. Includes hands-on exercises with typography and layout tools.
26	16	From Renaissance to Modernism – Key Movements & Masters	\N	/backend/uploads/Renaissance_compressed.pdf	2025-06-29 14:35:15.952502	Explore the evolution of Western art from the 15th to 20th centuries
27	15	Fundamentals of Digital Illustration & Concept Art	\N	/backend/uploads/digitalpainting-careerguide.pdf	2025-06-29 14:39:03.719947	Master the core skills of digital illustration, from sketching to final rendering. Learn industry techniques for character design, environment art, and storytelling through visuals.
\.


--
-- TOC entry 4984 (class 0 OID 16514)
-- Dependencies: 226
-- Data for Name: meetings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.meetings (id, course_id, title, meeting_link, description) FROM stdin;
6	10	Simulation: UN Security Council Debate on Climate Security	https://university.zoom.us/j/5558881234?pwd=WXp5d2NtRjFkRz09	Students role-play as UN delegates, negotiating solutions to climate-induced conflicts, applying diplomacy skills and IR theories in a practical scenario.
8	4	Computational Thinking & Problem Solving Workshop	https://zoom.us/j/1234567890?pwd=164573464	Brief review of key topics: decomposition, abstraction, algorithms.
9	17	Design Critique Workshop	https://zoom.us/j/5551234567	This interactive workshop is designed to help students refine their design skills through peer feedback and professional critique.
10	14	Masterpiece Recreation Challenge	https://zoom.us/j/9876543210?pwd=AR7H1ST0RY	Dive into art history by recreating a famous painting with a modern twist! Use any digital tool or traditional media, then share your work for live feedback.
11	14	The Gallery Survivor Game	https://zoom.us/j/1122334455?pwd=F1N3AR7G4LL3RY	Play curator! In teams, build a mini-exhibition... then vote to "delete" one piece each round. Defend your choices and discover how editing shapes art history narratives.
\.


--
-- TOC entry 4980 (class 0 OID 16453)
-- Dependencies: 222
-- Data for Name: participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.participants (id, course_id, user_id) FROM stdin;
2	4	3
6	14	3
7	15	3
8	13	3
9	12	3
10	11	3
11	10	3
12	4	21
16	14	24
17	14	26
18	14	28
19	14	21
20	15	24
21	15	26
22	15	28
23	15	21
24	16	3
25	16	24
26	16	28
27	16	26
28	16	21
29	17	3
30	17	21
31	17	22
32	17	24
33	17	29
34	18	3
35	18	27
36	18	25
37	18	23
38	18	22
39	4	22
40	4	23
41	4	25
42	4	26
43	4	27
\.


--
-- TOC entry 4988 (class 0 OID 16584)
-- Dependencies: 230
-- Data for Name: quiz_questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quiz_questions (id, quiz_id, question_text, options, correct_answer) FROM stdin;
19	15		["", "", "", ""]	[]
25	21	What is the defining feature of the international system according to realist theory?	["Cooperation under international law", "Anarchy (absence of a central authority)", "Economic interdependence", "Universal human rights enforcement"]	[1]
26	21	Which of the following best exemplifies "soft power"?	["Military alliances like NATO", "Economic sanctions on a rival state", "Cultural influence (e.g., Hollywood, K-pop)", "Coercive diplomacy with threats of force"]	[2]
27	21	Sovereignty in international relations refers to:	["A state’s ability to dominate its neighbors", "A state’s supreme authority over its territory and independence from external control", "Membership in the United Nations", "The elimination of national borders"]	[1]
28	21	Which theoretical approach emphasizes the role of institutions, norms, and cooperation in global politics?	["Realism", "Liberalism", "Marxism", "Constructivism"]	[1]
29	21	Constructivism in IR focuses primarily on:	["The distribution of military power", "How shared ideas and identities shape state behavior", "Free trade as a driver of peace", "Class struggle between capitalists and workers"]	[1]
34	26	What are the four key components of computational thinking?	["Sorting, Looping, Debugging, Executing", "Decomposition, Pattern Recognition, Abstraction, Algorithm Design", "Input, Processing, Output, Storage", "Variables, Functions, Classes, Objects"]	[1]
35	26	Why is abstraction important in computational thinking?	["It helps ignore irrelevant details and focus on essential features.", "It ensures all data is stored securely.", "It speeds up code execution.", "It prevents errors in algorithms."]	[0]
36	26	Which problem-solving strategy involves breaking a problem into smaller, manageable parts?	["Trial and Error", "Divide-and-Conquer", "Heuristic Method", "Brute Force"]	[1]
37	26	What is the purpose of creating and organizing computational items?	["To make programs run faster", "To improve workflow efficiency and clarity", "To delete unnecessary files automatically", "To increase storage capacity"]	[1]
38	26	When deleting items in a computational task, what should you consider first?	["Whether the item is backed up or no longer needed", "The size of the item", "The color of the file icon", "The programming language used"]	[0]
39	27	What is the primary purpose of a "value study" in digital illustration?	["To experiment with different brushes", "To establish light, shadow, and form before adding color", "To create a final polished artwork", "To organize layers in a file"]	[1]
40	27	Which of these is a key principle of concept art?	["Focusing only on realistic details", "Communicating ideas quickly and clearly", "Avoiding thumbnail sketches", "Using only black and white"]	[1]
41	27	Why is layer organization important in digital illustration?	["It makes the file size smaller", "It automatically applies textures", "It allows for non-destructive editing and easier adjustments", "It speeds up rendering time"]	[2]
\.


--
-- TOC entry 4996 (class 0 OID 16657)
-- Dependencies: 238
-- Data for Name: quiz_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quiz_results (id, quiz_id, user_id, correct_answers_count, grade) FROM stdin;
25	21	3	5	10.00
\.


--
-- TOC entry 4986 (class 0 OID 16569)
-- Dependencies: 228
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quizzes (id, course_id, title, description, timer, created_at) FROM stdin;
15	11	test	test	2	2025-05-07 15:35:23.999224
21	10	Key Concepts in Global Politics - Quiz 1	A 15-minute quiz testing understanding of core IR concepts (e.g. sovereignty, anarchy, soft power) and the differences between major theoretical approaches	15	2025-05-16 20:19:04.475903
26	4	Computational Thinking & Problem Solving Basics	Test your understanding of computational thinking principles, problem-solving strategies, and item management with this short quiz.	10	2025-06-29 14:24:51.800177
27	15	Digital Illustration Basics	Answer the following questions to test your understanding.	15	2025-06-29 14:40:45.383314
\.


--
-- TOC entry 5000 (class 0 OID 16724)
-- Dependencies: 242
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.requests (id, full_name, username, email, password, role) FROM stdin;
\.


--
-- TOC entry 4976 (class 0 OID 16415)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, full_name, username, email, password, role) FROM stdin;
28	Ioana Bauer	ioana_bau	ioana_bau@gmail.com	$2b$10$aFKCiYLdKIOwRO9Iyoe6L.UCKJsWhzIXp2WxFuBf8RMPPdk0AeLRG	Student
29	Diana Popovici	diana_didi	diana_didi@gmail.com	$2b$10$IT0uche9s1rCk6ySXAk5n.ZXtM6NroespfZg.NyRUbwGgA3xfHYw2	Student
4	Professor Mihai	mihai.prof	prof.acc@gmail.com	$2b$10$pD9HjrhTHbpG3bzfI.s2MuY9kVDbJC/zDQoj8ucyH7QEXtQROH/bG	Professor
5	Gabriel Munteanu	gabriel.munteanu	admin.acc@gmail.com	$2b$10$nj3dpVUMlTWRRFj9PCJ.J.wD.Rg9sAFrY6b453hwyI/sauxvfbCm.	Admin
3	Antal Krisztian	krisz.antal	stud.acc@gmail.com	$2b$10$WoBzDyhbydDWjl7RQ/Y6iOjGt0fwc8LGtpV2lWnKL7q./TeAklpE.	Student
11	Popescu Florin\n	pop.florin	pop.florin@gmail.com	$2b$10$jpWgKZuuZQ/oYT7zquiR6O7KNAaKswfoCC9HxcKjnnnQZoouzM1Ra	Professor
12	Madalina Ionescu	mada.ionescu	mada.ionescu@gmail.com	$2b$10$3tJp9WV08AcFCL.5aIskAuU8eVH5Yhh8ALjxTDLwRndPhIA4eq3WS	Professor
13	Georgescu Teodor	georgescu.teo	georgescu.teo@gmail.com	$2b$10$.dIa.e5.MoKG7TXGsAyx3uSGXnk4VePDFb.Td.8HLnng.AwR27gqa	Professor
14	Elena Dumitrescu	elena.elena11	elena.elena11@yahoo.com	$2b$10$W1I.naZlq1ewvBTE0wggm.IjnV39jMyW0lS4sgZVUiNCVcxC/IaY6	Professor
15	Marin Vasilescu	marin.vasi24	marin.vasi24@yahoo.com	$2b$10$dtTruE5PgU4GfmY.xXibtOK83DjTqefS2LdV6o5kEcmUH7qQDcd0O	Professor
16	Ana Popa	popa.ana	popa.ana@gmail.com	$2b$10$szxtw8C6NiiWTryIHqK0SOhXypmfLnRNnDJZiXNjA96bDgWZoqJdy	Professor
17	Radu Stan	radu.stan	radu.stan@yahoo.com	$2b$10$TrN/XVEltIziHRIK2EG9d.V92iGUM8aUGVJt/dYuRus9wSHfXgHBe	Professor
18	Mihaela Constantin	miha.constantin	miha.constantin@gmail.com	$2b$10$UeGWLZtNAsIxpj9PQhEuZel8NZQyyreNkFsdm1HwYVqbVQxebRz72	Professor
19	Andrei Moldovan	andrei.moldo	andrei.moldo@gmail.com	$2b$10$ZMgLyvXEx3.QGQgjBue/FOwTfxk249vXpnTOmUijx9ICYz.9DPgfq	Professor
20	Claudia Dragomir	claudia.clau44	claudia.clau44@yahoo.com	$2b$10$J8iKXR3F2BNZq.V835Otx.6jkz0aPG8yeg9yo6BOKyJWTvu/XUfhi	Professor
21	Alexandru Popa	alex.popa	alex.popa@gmail.com	$2b$10$lI2pmpX8jEXgiz9QOs5m/utHGy0aSDNj.2SPdvri1w2iV2zYJxa4W	Student
22	Maria Dumitrescu	maria.maria2	maria.maria2@gmail.com	$2b$10$sLYsjcxOoibB30rPMP1flOrDdKUBqDFb4cfVQVDy.ydZ7r.iTiRaS	Student
23	Stefan Istrate	istrate.stefan	istrate.stefan@yahoo.com	$2b$10$ciTqzf/hndfMsE8ZtieWxeGhGyS8c4fXY6xUMJCgIA4B6GUISY1S2	Student
24	Ana-Maria Cojocaru	ana.maria.cojo	ana.maria.cojo@gmail.com	$2b$10$uR9FcbyOO3UF7ybXZHn5S.FzeK2pG9N6VJi4jy8CezPFdeVTwpze2	Student
25	David Marin	david_marin	david_marin@gmail.com	$2b$10$mwlNWLo3n2fhRlOxEUGQ6.1chHP6ZQ3bhtCrPIeZEyiKRh2guhsvW	Student
26	Elena Mandache	elena_mandache	elena_mandache@yahoo.com	$2b$10$wH5Ts1CP1WsbebUrjaI1BumsTP1gZWUC/.HnIxp/VHksuNBWVekdu	Student
27	Andrei Ardelean	andrei.ardelean	andrei.ardelean@yahoo.com	$2b$10$u9zCNrRtJj..t9XEmMOuoOcY1ctlA42YRHYLPIxXewijagFR8jtZO	Student
\.


--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 239
-- Name: announcements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.announcements_id_seq', 10, true);


--
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 235
-- Name: assignment_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assignment_submissions_id_seq', 44, true);


--
-- TOC entry 5021 (class 0 OID 0)
-- Dependencies: 231
-- Name: assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assignments_id_seq', 24, true);


--
-- TOC entry 5022 (class 0 OID 0)
-- Dependencies: 219
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_id_seq', 19, true);


--
-- TOC entry 5023 (class 0 OID 0)
-- Dependencies: 233
-- Name: grades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.grades_id_seq', 1, false);


--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 223
-- Name: lessons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lessons_id_seq', 27, true);


--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 225
-- Name: meetings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.meetings_id_seq', 11, true);


--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 221
-- Name: participants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.participants_id_seq', 43, true);


--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 229
-- Name: quiz_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quiz_questions_id_seq', 41, true);


--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 237
-- Name: quiz_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quiz_results_id_seq', 29, true);


--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 227
-- Name: quizzes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quizzes_id_seq', 27, true);


--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 241
-- Name: requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.requests_id_seq', 3, true);


--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 32, true);


--
-- TOC entry 4809 (class 2606 OID 16691)
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- TOC entry 4803 (class 2606 OID 16644)
-- Name: assignment_submissions assignment_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT assignment_submissions_pkey PRIMARY KEY (id);


--
-- TOC entry 4797 (class 2606 OID 16606)
-- Name: assignments assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_pkey PRIMARY KEY (id);


--
-- TOC entry 4785 (class 2606 OID 16446)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- TOC entry 4799 (class 2606 OID 16620)
-- Name: grades grades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_pkey PRIMARY KEY (id);


--
-- TOC entry 4801 (class 2606 OID 16622)
-- Name: grades grades_quiz_id_student_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_quiz_id_student_id_key UNIQUE (quiz_id, student_id);


--
-- TOC entry 4789 (class 2606 OID 16478)
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- TOC entry 4791 (class 2606 OID 16521)
-- Name: meetings meetings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meetings
    ADD CONSTRAINT meetings_pkey PRIMARY KEY (id);


--
-- TOC entry 4787 (class 2606 OID 16458)
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (id);


--
-- TOC entry 4795 (class 2606 OID 16591)
-- Name: quiz_questions quiz_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT quiz_questions_pkey PRIMARY KEY (id);


--
-- TOC entry 4805 (class 2606 OID 16662)
-- Name: quiz_results quiz_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_results
    ADD CONSTRAINT quiz_results_pkey PRIMARY KEY (id);


--
-- TOC entry 4807 (class 2606 OID 16664)
-- Name: quiz_results quiz_results_quiz_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_results
    ADD CONSTRAINT quiz_results_quiz_id_user_id_key UNIQUE (quiz_id, user_id);


--
-- TOC entry 4793 (class 2606 OID 16577)
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (id);


--
-- TOC entry 4811 (class 2606 OID 16735)
-- Name: requests requests_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_email_key UNIQUE (email);


--
-- TOC entry 4813 (class 2606 OID 16731)
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- TOC entry 4815 (class 2606 OID 16733)
-- Name: requests requests_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_username_key UNIQUE (username);


--
-- TOC entry 4779 (class 2606 OID 16426)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4781 (class 2606 OID 16422)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4783 (class 2606 OID 16424)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4826 (class 2606 OID 16645)
-- Name: assignment_submissions assignment_submissions_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT assignment_submissions_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id) ON DELETE CASCADE;


--
-- TOC entry 4827 (class 2606 OID 16650)
-- Name: assignment_submissions assignment_submissions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT assignment_submissions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4823 (class 2606 OID 16607)
-- Name: assignments assignments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- TOC entry 4816 (class 2606 OID 16707)
-- Name: courses courses_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4821 (class 2606 OID 16578)
-- Name: quizzes fk_course_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT fk_course_id FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- TOC entry 4822 (class 2606 OID 16592)
-- Name: quiz_questions fk_quiz_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT fk_quiz_id FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;


--
-- TOC entry 4824 (class 2606 OID 16623)
-- Name: grades grades_quiz_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;


--
-- TOC entry 4825 (class 2606 OID 16628)
-- Name: grades grades_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4819 (class 2606 OID 16692)
-- Name: lessons lessons_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- TOC entry 4820 (class 2606 OID 16697)
-- Name: meetings meetings_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meetings
    ADD CONSTRAINT meetings_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- TOC entry 4817 (class 2606 OID 16712)
-- Name: participants participants_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- TOC entry 4818 (class 2606 OID 16702)
-- Name: participants participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4828 (class 2606 OID 16665)
-- Name: quiz_results quiz_results_quiz_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_results
    ADD CONSTRAINT quiz_results_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;


--
-- TOC entry 4829 (class 2606 OID 16670)
-- Name: quiz_results quiz_results_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_results
    ADD CONSTRAINT quiz_results_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-06-29 15:18:34

--
-- PostgreSQL database dump complete
--

