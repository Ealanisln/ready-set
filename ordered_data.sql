--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6
-- Dumped by pg_dump version 16.6 (Homebrew)

-- Disable all triggers
DO $$
DECLARE
  table_record RECORD;
BEGIN
  FOR table_record IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE 'ALTER TABLE ' || quote_ident(table_record.tablename) || ' DISABLE TRIGGER ALL';
  END LOOP;
END $$;

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
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."user" (id, guid, name, email, "emailVerified", image, password, "passwordResetToken", "passwordResetTokenExp", type, company_name, contact_name, contact_number, website, street1, street2, city, state, zip, location_number, parking_loading, counties, time_needed, catering_brokerage, frequency, provide, head_count, status, side_notes, confirmation_code, remember_token, updated_at, "isTemporaryPassword") FROM stdin;
cm2gkgkyr000011g74f3i4zh2	\N	Crystal Rapada	crystal@ready-set.co	\N	\N	$2a$10$KzUug12wfiMPsOSa9TeTo.d7P6bVrxhN7K5I5B4vWOl/RW3jhhmgO	89b83b99bf35d73a1eea89e3e87afe87a918eba38ba8008f7e04ca7ce33a3757	2024-10-20 19:43:19.586	admin	\N	\N	4154042345		246 Hidden Creek Court		Martinez	CA	94553	\N								active	\N	\N	\N	2024-10-19 19:43:19.586+00	2024-10-22 22:07:03.368+00	t
cm1fn7rf50000szk3cpba113x	\N	Fernando Cardenas	fsanchezcln@gmail.com	\N	\N	$2a$10$rrfO38MhgKxduUtVm8Eg4Ox1ynFZXGfql0.FfVnw9pzeToP6peYcS	a4cefbc50aa1118ca06e200eeacce29db3a2e7d1	2024-09-26 02:04:45.454	super_admin	\N	\N	4155352544	\N	1120 Eaton Av Apt 9		San Carlos	California	94070	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-09-23 23:32:58.38+00	2024-09-27 23:52:10.568+00	f
cm1le83w90000o8jzjkqmgm7w	\N	LUTHER C HOMILDA	luther@ready-set.co	\N	\N	$2a$10$8SrP4yhl/rWpych1JRc7GO0Olrka/UEDen23.QGqESI3mENqefMYW	\N	\N	admin	\N	\N	9479366264	\N	MALATABIS, BARANGAY LIZADA, TORIL		DAVAO CITY	DAVAO DEL SUR	8000	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-09-28 00:07:55.063+00	2024-09-28 00:11:31.161+00	f
cm3xlz2zf0000f1mrugdw9sko	\N	Mai Vallejo-Yap	mai3@ready-set.co	\N	\N	$2a$10$cZpMHUpcF2mcd54vr9HCkeeSgJJkCTxP/AVw4VzHMW1cbEHxiygFa	7c38d15245d102036a52ffc08772e91b170079535ff032115848a090a6b38cff	2024-11-26 22:37:29.69	client	RS-Test	\N	+63 9497070741		Sanasa St		Davao CIty	Philippines	90210	\N	Test for the Client Sign Up page	Alameda	Breakfast	\N	1-5 per week	\N	1-24	deleted	\N	\N	\N	2024-11-25 22:37:29.69+00	2024-11-26 16:10:54.97+00	t
cm2ee6e7y0000g58kkqj13dvj	\N	Fer Sanz	fcardenas@ready-set.co	\N	\N	$2a$10$yeNp3SLUA7F9sJHXmtLZZO1yaECh5raAzXMOK7YSAMquRBYGxuzaK	667e09c65ab8202054edae188258f934bb65fd00	2024-10-18 07:22:49.313	driver	\N	\N	4775808089	\N	10 Main St		Burlingame	California	94050	\N	\N				\N		\N	deleted	\N	\N	\N	2024-10-18 07:11:54.237+00	2024-11-20 16:51:27.546+00	t
cm3xlb4im0000dqslfaisudei	\N	Leneth Logrono	leneth@ready-set.co	\N	\N	$2a$10$JC0./sYa1RXxHKsolJ/1A.PGpcuEWGxSTh1wnO/EPwXkR8eJewcNu	d6d0b1d560a3b1588953d082f2365fc1c70997d8ae18be38cb9e9bee57d8dcba	2024-11-26 22:18:51.933	admin	\N	\N	+639153520027	\N	St. Jude 		Davao City	Philippines	8025	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-11-25 22:18:51.933+00	2024-11-26 15:55:06.367+00	f
cm2ce3o5k0000jk45dtqvtcsv	\N	Fernando Cardenas 	cromo181@gmail.com	\N	\N	$2a$10$goJ82HoY65P7RrA.Y2bW9OEw9PBE2zeQP3Pt8Xw1.oKn4kPbaRIne	318146a28862d2c8629fdc766e3cab0bb51498ba0c15051d9c5ce0607efd61f8	2024-10-17 21:34:14.791	driver			4155352534		1120 Eaton Av Apt 10		San Carlos	California	94070									deleted	\N	\N	\N	2024-10-16 21:34:14.791+00	2024-11-26 15:55:26.707+00	f
cm3xj97bz000010e9mgdu6b6i	\N	Mai Vallejo-Yap	mai@ready-set.co	\N	\N	$2a$10$9fDg3CLfAqbEbOsqH/Us1.aQQaFLS6W0Zu9zovWf8lvGNLJ21oLai	9c987b76fb1d30d1fb672c109b23b85554d9c6aa46951e7c074c8c6c912a8192	2024-11-26 21:21:23.038	admin	\N	\N	+63 9497070741	\N	Sanasa St.		Davao City	Philippines	80000	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-11-25 21:21:23.038+00	2024-11-26 15:55:50.724+00	f
cm3xlccv50005dqsl2h64wceq	\N	Mai Vallejo-Yap	mai2@ready-set.co	\N	\N	$2a$10$EVfPAPx0Tt1vh5mAOICN8u9PNfuGooeF.HYNO371.9mi7/sUZDNym	94b4ad76f3a9a72f7d5dd61f33cbe950c9c333ebb7e6196386b9d54000f4585d	2024-11-26 22:19:49.408	vendor	RS-Test2	\N	+63 9497070741		Sanasa St		Davao City	Philippines	8000	\N	Test for Vendor registration under Sign Up Page	Alameda	Lunch	Foodee	1-5 per week	Place Settings	\N	deleted	\N	\N	\N	2024-11-25 22:19:49.408+00	2024-11-26 16:10:44.793+00	t
cm3yym2bd000010t4ljfvz2kc	\N	Bon Gonzales	bon@ready-set.co	\N	\N	$2a$10$0DUMlOwmoWdxwUEyndVGPODeDhLIk6IMHDwb9jtDrF.N5FICPUtEe	6d4a950047ac20362428ad23ba8312d8f121a5c81b3eeb8df3b7a80aa43669dc	2024-11-27 21:19:03.47	helpdesk	\N	\N	4152266872		Agabus Street		Dala City	California	94014	\N					\N		\N	active	\N	\N	\N	2024-11-26 21:19:03.47+00	2024-12-16 16:01:06.859+00	t
cm2vcik0o00001276nfupzx52	\N	Jose Sanchez 	jsanchez.riman@icloud.com	\N	\N	$2a$10$gdt/oGLQ2Z038WAhlQnM/ufXjZZ8h0wQm8n.oRMOdKJCQHDEYDTYG	9babafb70975a9692892141022903d9c15291b6b5737d125a7b280ba06550a69	2024-10-31 03:57:27.383	driver	\N	\N	415-214-4970	\N	33 8th St	1704	San Francisco	CA	94103	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2024-10-30 03:57:27.383+00	2024-12-10 18:12:13.103+00	t
cm407k5a4000034gtqi97ttn6	\N	Mai Vallejo-Yap	mai@ready-set.com	\N	\N	$2a$10$d1DjRgS/EAlyBXi6vCEVIupHRwRNnehvWqqo4NS.z368ljfdk/l3C	d553141b4364e966eb351ab25b5ed828784df391987df7149a3dd624377c0ca8	2024-11-28 18:17:16.73	vendor	RS-Test	\N	+63 9497070741		Sanasa St		Davao CIty	Philippines	8000	\N		Alameda	Breakfast	Foodee	1-5 per week	Utensils	\N	active	\N	\N	\N	2024-11-27 18:17:16.73+00	2024-12-16 16:00:37.494+00	t
cm2q9pj4j0000m95sb6fqm567	\N	Gerome Rogers	missalexsito@gmail.com	\N	\N	$2a$10$YtFsJ1dNWT24ChDgqVMF1.zV4UM7PRFELPV4DD1yGxT.kgGzOUNTS	fe0e1c28bc706542562e8cbb8e22a3349e51626ce4f385e529397c5ad69540db	2024-10-27 14:40:03.089	driver	\N	\N	2028197833	\N	2660 Royal Ann dr		Union City	CA	94587	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2024-10-26 14:40:03.089+00	2024-12-10 18:11:54.838+00	t
cm4d2x9xy0000bjtxb71cwwf9	\N	Vendor	vendordummy@gmail.com	\N	\N	$2a$10$7MHBDaFLgq4YQxgKwylST.LgHwxx1W8FDLCCGcHZK1tEPX27u1MF6	\N	\N	vendor	Vendordummy	\N	(415) 823-3305	https://vendordummy.com	595 Alabama St, 		San Francisco	United States	94110	\N	Yes	San Francisco, San Mateo	Breakfast, Lunch, Dinner	Foodee, Cater Cow, Ez Cater	6-15 per week	Napkins, Labels	\N	active	\N	\N	\N	2024-12-06 18:28:31.509+00	2024-12-16 16:01:31.449+00	f
cm4d1ctys0000lqgv4yzimj95	\N	Andrea Fetalyn	andrea@ready-set.co	\N	\N	$2a$10$Kwr.tT/41PC4dlCG7HxCgerLhXf9o0ESAaNDYkpvnwZm72LZFaVX.	\N	\N	client	Andrea Gwapa	\N	12345678		103 Horne Avenue, San Francisco, CA, 		Daly	California	94124	\N		San Francisco	Lunch	\N	1-5 per week	\N	1-24	active	\N	\N	\N	2024-12-06 17:44:38.067+00	2024-12-16 16:02:00.605+00	f
cm4ir4ljx0000562z3htnuy0a	\N	Mai Vallejo-Yap	iammai0409@gmail.com	\N	\N	$2a$10$Z88Lh7JipfnF7LlJAH8TmOaWuF95CAWH5dKnmAmNHx4nCz5Yjev0W	\N	\N	driver	\N	\N	+63 9497070741	\N	Sanasa St		Davao CIty	Philippines	8000	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-12-10 17:44:54.811+00	2024-12-16 16:02:12.225+00	f
cm3tvokg200008cln9d5j05xf	\N	Mahesh	j.mahesh1388@gmail.com	\N	\N	$2a$10$Y8ALolEEBUeNZm/J9Uq9W.WtR22eIliRcMSxamnxhBMXzMDxh06K6	\N	\N	driver	\N	\N	4086009153	\N	620 Iris Ave	432	Sunnyvale	CA	94086	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-11-23 07:58:10.561+00	2024-12-20 19:24:25.492+00	f
cm1fkjwho00009vg82l7w8bl8	\N	Emmanuel	ealanis@ready-set.co	\N	\N	$2a$10$PJAsFR4.tg9a1vla/qAIxupj53piEKPD/iBR11EwwJdJ3qDCot0.K	\N	\N	super_admin	Alanis Web Dev		4157698180		123 Main St		San Carlos	CA	94070									active	\N	\N	\N	2024-09-23 22:18:25.978+00	2025-01-27 15:45:20.019+00	f
cm1p09lex0000c52xo648i3dz	\N	April	jing@ready-set.co	\N	\N	$2a$10$nrbauHG4cK.SFRGXhIupb.I5LQHzn0PYSSPCvcHROBCMD43TLiHq2	\N	\N	admin	\N	\N	+639171385390	\N	Mandug		Davao 	Philippines	8000	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-09-30 12:48:14.504+00	2025-01-27 15:53:57.685+00	f
cm1ozjqe90000my9clp6ntsmy	\N	Honey Bagay	honey@ready-set.co	\N	\N	$2a$10$H66sJ2CkR7p.Y2A1cYKQw.JvVkRtowr1sMP.7JS7hOd79M0X4JGXK	\N	\N	super_admin	\N	\N	+639364572029	\N	Purok 7	Bongabong	Pantukan	Davao De Oro	8809	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-09-30 12:28:07.904+00	2024-12-10 17:04:54.004+00	f
cm6f5hyaz000al5035pehzy6s	\N	Hanna McPhee	hannamcphee@gmail.com	\N	\N	$2a$10$0nBCMx2ip5iKoManQa0PE.02zIWSbRylkRNgTdonqebc7rfr2aBYy	\N	\N	driver			+1 917-836-3845		115 E Santa Clara St		San Jose	CA	95113									pending	\N	\N	\N	2025-01-27 14:35:32.458+00	2025-01-27 16:08:51.965+00	f
cm6fbafxc0000l503ln5qbpo0	\N	Mai Vallejo-Yap	mai@readysetllc.com	\N	\N	$2a$10$rTS0pLhWbcMJgG0wpJQGdeGjH7d/AOejBYdTUs3PJCISs9gzj6neG	\N	\N	vendor	RS-Test	\N	+63 9497070741	https://readysetllc.com/	Test 		Test 	Test 	Test 	\N		San Mateo	Lunch	Other	6-15 per week	Utensils, Napkins, Place Settings, Labels, Serving Utensils	\N	pending	\N	\N	\N	2025-01-27 17:17:39.742+00	2025-01-27 17:17:39.742+00	f
cm4itthva00001wzjge3dfyln	\N	Lezylane Andig	lezylane@ready-set.co	\N	\N	$2a$10$Lkbhhc291D/smtwHLskS8uKZfVPp5DnqnZ.yTL3W.0cigr2d6FEQ2	95ec2fad2b89067e19e6ef6aa1261b99089ece09	2024-12-10 19:34:53.482	admin	\N	\N	+639178913415	\N	San Victores St.	Barangay 9, Purok 1	Malaybalay City	Bukidnon	8700	\N	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2024-12-10 19:00:15.668+00	2024-12-10 19:24:53.483+00	f
cm405b3ix0000icpl180rrsb3	\N	Mai Vallejo-Yap	chelledah@ready-set.co	\N	\N	$2a$10$HOvosrBb5/FZcQK2wqXHzO6qgZtwZlA7QRRdAwwFmbLcoN/GVmLm.	a11c161321a9f4208eb614e20dbd58a8b480428bd37b014641df381c155e27fa	2024-11-28 17:14:15.319	vendor	RS-Test		+63 9497070741		Sanasa St		Davao CIty	Philippines	94010			Santa Clara	Dinner	Zero Cater	6-15 per week	Place Settings		active	\N	\N	\N	2024-11-27 17:14:15.319+00	2024-12-16 16:01:50.191+00	f
cm5psyzdk0000js03ngzaqmmc	\N	April Ducao	aprild963@gmail.com	\N	\N	$2a$10$eWu9SOJdhLltxaEPnKdIu.7DHmuFKfLb0V7w6xx0Kmzh.sIEksAHG	\N	\N	helpdesk	\N	\N	+639171385390	\N	DDF Village 		Davao 	Philippines	8000	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2025-01-09 20:50:37.582+00	2025-01-09 20:50:37.582+00	f
cm6ebiiyv0000l503g002yn62	\N	Honey	honeybagay.hb@gmail.com	\N	\N	$2a$10$GLjoctxymr7w3hM0nxEhhuabxJ6/TuG7WWNgiBNecpiJzA5tRV/W6	\N	\N	vendor	Dummy Yum 	\N	+1 415 226 6872		Purok 7, Bongabong		Pantukan	Davao De Oro	8809	\N	N/A	San Francisco	Lunch	Direct Delivery	1-5 per week	Serving Utensils	\N	pending	\N	\N	\N	2025-01-27 00:36:10.758+00	2025-01-27 00:36:10.758+00	f
cm6ebo97x0000jx03p5fweiwi	\N	Honey	dummyyum@gmail.com	\N	\N	$2a$10$.MEDS4Ts0.GbxVCw8HEHDulsRFaC80/2GwghlfKoWQ0gCE6w96b42	\N	\N	client	Dummy Yum 	\N	09364572029		Purok 7, Bongabong		Pantukan	Davao De Oro	94105	\N	N/A	San Francisco	All Day	\N	1-5 per week	\N	1-24	pending	\N	\N	\N	2025-01-27 00:40:38.06+00	2025-01-27 00:40:38.06+00	f
cm6edfobg0000if03hllik9gg	\N	Elon Musk	elonmust@gmail.com	\N	\N	$2a$10$VPVPB0IFanyxwVZS1cuDhu4w0qq3VJXI4ltLELIL3ZLA.RYAQA4uW	\N	\N	driver	\N	\N	650741 0676	\N	1033  	Irving Street	San Francisco	California	94122 	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2025-01-27 01:29:56.954+00	2025-01-27 01:29:56.954+00	f
cm6f5cied0000l5037q35goed	\N	Nadav Ullmanis	nadav@tryleverage.com	\N	\N	$2a$10$zwb4EpkrhhO9r2Sam6aKiOg.pnaIF1EzMzrkeHQag4NJvYSm4Xnyu	\N	\N	vendor	Proactive Supply Chain Group	\N	+1 929-470-3086	https://tryleverage.ai/	1101 Shoreway Road		Belmont	CA	94002	\N		Alameda, Marin, San Francisco, Santa Clara, Solano	All Day	Other	over 25 per week	Serving Utensils, Labels, Utensils, Napkins, Place Settings	\N	pending	\N	\N	\N	2025-01-27 14:31:18.563+00	2025-01-27 14:31:18.563+00	f
cm6f5fypt0005l5037w379f9b	\N	Kenny C	lspiller@proactivegroupusa.co	\N	\N	$2a$10$a7Qh3CLPE0mpJBOO.wqQwOgdaGpHtU3zGH/109maKY4pCpfUWKhp2	\N	\N	client	KC Logistics	\N	+1 416-798-3303		5501 Balcones Drive		Austin	TX	78731	\N		Alameda, Marin, San Francisco, Santa Clara, Santa Cruz, Sonoma, San Mateo	All Day	\N	over 25 per week	\N	250-299	pending	\N	\N	\N	2025-01-27 14:33:59.68+00	2025-01-27 14:33:59.68+00	f
cm6f5r3lx000fl503pmm7nwra	\N	Rosen Zhelev	rosenz123@gmail.com	\N	\N	$2a$10$CsO9r4ZbY1nw3HThWppQb.Xcd8xr3zeo5sc1klXSscoPV3352zRFq	\N	\N	driver	\N	\N	+1 415-371-9306	\N	2100 Geng Rd\t		Palo Alto	California	94303	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2025-01-27 14:42:39.225+00	2025-01-27 14:42:39.225+00	f
cm6f5xxps0000l50314zhxw6r	\N	Royce Paris	royce@andthem.co.llc	\N	\N	$2a$10$SbJAbjSImvR/ttuiTuskbef/OW6S/csBhxETCuQb1WUD8K3AGbQxu	\N	\N	helpdesk	\N	\N	+1 612-600-9012	\N	560 Alabama St		San Francisco	California	94110	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2025-01-27 14:47:58.189+00	2025-01-27 14:47:58.19+00	f
cm6fbolcp0000jy03ba7unntt	\N	Mai Vallejo-Yap	egzyap@gmail.com	\N	\N	$2a$10$SZP.EO/Kpox05MUWJpkjxu1m24fH9whn4QqZVnKcgXInm1ddmTcGS	\N	\N	client	RS-Test	\N	+63 9497070741		Test		Test	Test	90210	\N		San Mateo	Lunch	\N	1-5 per week	\N	1-24	pending	\N	\N	\N	2025-01-27 17:28:39.959+00	2025-01-27 17:28:39.959+00	f
cm6fc2m7t0000jy03mklj818r	\N	Mai Vallejo-Yap	vallejonorserita@gmail.com	\N	\N	$2a$10$qn0sV22RVgrfOWLBPCVUXOx5sBoKJpnH4ZALH5Z5oGEDpdjGd4SSC	\N	\N	driver	\N	\N	+63 9497070741	\N	Test		Test	Test	Test	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2025-01-27 17:39:34.263+00	2025-01-27 17:39:34.263+00	f
cm6fc8p410000ib03dqmq94im	\N	Mai Vallejo-Yap	maitest@ready-set.com	\N	\N	$2a$10$uDJouGJ2cDyNw3smJN2Clui7S/y85eqqDj/VYA.pbeg.XOyX44GH6	\N	\N	helpdesk	\N	\N	+63 9497070741	\N	Test		Test	Test	Test	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	2025-01-27 17:44:17.953+00	2025-01-27 17:44:17.953+00	f
cm6fezuqp0000l103xrxsm6d7	\N	Leneth	taniku1035@gmail.com	\N	\N	$2a$10$I8m20/BW4nLIcmxgSecv7eP0wkajrS.YclqZKwQP7t2VZDzfcc0M6	\N	\N	vendor	Sweet Bar Bakery	\N	415-226-6872		2355 Broadway		Oakland	California	94612	\N		Alameda, San Francisco	Breakfast	Direct Delivery	1-5 per week	Labels	\N	pending	\N	\N	\N	2025-01-27 19:01:24.192+00	2025-01-27 19:01:24.192+00	f
cm6ff3val0005l103n9t0um4c	\N	Leneth	derek@overseagency.com	\N	\N	$2a$10$mU7cxJkjIA0qEznaL346keY2dOvlJqG2unfBKRFU3Jhi6PlZYfGEq	\N	\N	client	123 company, LLc	\N	415-226-6872		851 Main St		Redwood City	 California	94063	\N		San Francisco, San Mateo	Breakfast	\N	6-15 per week	\N	50-74	pending	\N	\N	\N	2025-01-27 19:04:31.532+00	2025-01-27 19:04:31.532+00	f
cm6gmriqw0000i9035vukh3s2	\N	Kira Mackenzie 	behavefoodsinc@gmail.com	\N	\N	$2a$10$pu55OZGPO4sD6x3vfeX/VuZY97EaBw8BauFZd5bKDzUr0PC39azU.	\N	\N	vendor	Behave	\N	+1 202-251-4214	https://eatbehave.com/	1 King Street	Unit 6	New York	New York	10012 	\N		Alameda, Contra Costa, Marin, San Francisco, Santa Clara, Santa Cruz, San Mateo, Napa, Sonoma, Solano	All Day	Direct Delivery	over 25 per week	Utensils, Napkins, Place Settings, Serving Utensils, Labels	\N	pending	\N	\N	\N	2025-01-28 15:26:38.495+00	2025-01-28 15:26:38.495+00	f
cm6gmxjjn0005i90389uzug9h	\N	Taylor Wilkinson	taylor.wilkins@gmail.com	\N	\N	$2a$10$tanQhPddMCuJTKLOuFlB9.hbbbZmiNVSFgyXMcXLd.HdvU.0WBP02	\N	\N	client	Saffron Road Foods	\N	877.425.2587	https://saffronroad.com/	Summer Street		Stamford	Connecticut	06905	\N		Contra Costa, Napa, San Mateo, Santa Cruz, Sonoma, San Francisco	All Day	\N	6-15 per week	\N	+300	pending	\N	\N	\N	2025-01-28 15:31:19.475+00	2025-01-28 15:31:19.475+00	f
\.


--
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.address (id, county, street1, street2, city, state, zip, "createdAt", "createdBy", "isRestaurant", "isShared", "locationNumber", "parkingLoading", "updatedAt", name) FROM stdin;
48	Main Address	123 Main St		San Carlos	CA	94070	2024-10-01 23:53:39.491	\N	f	f	\N	\N	2024-10-01 23:53:39.491	\N
49	Main Address	29 Mami Av		Los Altos	California	97890	2024-10-01 23:53:39.491	\N	f	f	\N	\N	2024-10-01 23:53:39.491	\N
50	Main Address	310 Gellert Blvd	\N	Daly City	California	94015	2024-10-01 23:53:39.491	\N	f	f	\N	\N	2024-10-01 23:53:39.491	\N
51	Napa	303 Pivate Av	\N	Napa	California	93340	2024-10-01 23:53:39.491	\N	f	f	\N	\N	2024-10-01 23:53:39.491	\N
52	San Mateo	210 Alexandria St	\N	San Mateo	California	94020	2024-10-01 23:53:39.491	\N	f	f	\N	\N	2024-10-01 23:53:39.491	\N
53	Main Address	209 Miguel de Obregon Av		Livermore	California	90023	2024-10-01 23:53:39.491	\N	f	f	\N	\N	2024-10-01 23:53:39.491	\N
54	Main Address	330 Mediterranean Sea		Redwood City	California	94070	2024-10-01 23:53:39.491	\N	f	f	\N	\N	2024-10-01 23:53:39.491	\N
55	Main Address	1120 Eaton Av Apt 9		San Carlos	California	94070	2024-10-01 23:53:39.491	\N	f	f	\N	\N	2024-10-01 23:53:39.491	\N
58		39706 Cedar Boulevard  	\N	Newark 	CA	94560	2024-10-01 23:53:39.491	\N	f	f	\N	\N	2024-10-01 23:53:39.491	\N
57	Main Address	123 Main St	\N	San Carlos	CA	94070	2024-10-01 23:53:39.491	\N	f	f	\N	\N	2024-10-01 23:53:39.491	\N
56	Main Address	101 Horne Ave #1501, 	\N	San Francisco	CA	94124	2024-10-01 23:53:39.491	\N	f	f	\N	\N	2024-10-01 23:53:39.491	\N
59	San Mateo	123 Main St	\N	San Carlos	CA	94070	2024-10-01 23:53:39.491	\N	f	f	\N	\N	2024-10-01 23:53:39.491	\N
60	Main Address	MALATABIS, BARANGAY LIZADA, TORIL		DAVAO CITY	DAVAO DEL SUR	8000	2024-10-01 23:53:39.491	\N	f	f	\N	\N	2024-10-01 23:53:39.491	\N
61	Main Address	Purok 7	Bongabong	Pantukan	Davao De Oro	8809	2024-10-01 23:53:39.491	\N	f	f	\N	\N	2024-10-01 23:53:39.491	\N
62	Main Address	Mandug		Davao 	Philippines	8000	2024-10-01 23:53:39.491	\N	f	f	\N	\N	2024-10-01 23:53:39.491	\N
cm3xj97n9000210e9hatt0anq	\N	Sanasa St.		Davao City	Philippines	80000	2024-11-25 21:21:23.446	cm3xj97bz000010e9mgdu6b6i	f	f	\N	\N	2024-11-25 21:21:23.446	Main Address
cm4itti5q00021wzj8hlxvhth	\N	San Victores St.	Barangay 9, Purok 1	Malaybalay City	Bukidnon	8700	2024-12-10 19:00:16.046	cm4itthva00001wzjge3dfyln	f	f	\N	\N	2024-12-10 19:00:16.046	Main Address
cm2ee0tje0002wcdilgay3nct	\N	34 Arboleda St		San Mateo	California	94060	2024-10-18 07:07:34.155	\N	f	f	\N	\N	2024-10-18 07:07:34.155	Main Address
cm2ee6ei50002g58kfx5ky6ye	\N	10 Main St		Burlingame	California	94050	2024-10-18 07:11:54.605	cm2ee6e7y0000g58kkqj13dvj	f	f	\N	\N	2024-10-18 07:11:54.605	Main Address
cm2gkgl9b000211g7l7il5qql	\N	246 Hidden Creek Court		Martinez	CA	94553	2024-10-19 19:43:19.967	cm2gkgkyr000011g74f3i4zh2	f	f	\N	\N	2024-10-19 19:43:19.967	Main Address
cm3xlb4ua0002dqslrh9twbh2	\N	St. Jude 		Davao City	Philippines	8025	2024-11-25 22:18:52.354	cm3xlb4im0000dqslfaisudei	f	f	\N	\N	2024-11-25 22:18:52.354	Main Address
cm3xlcd5i0007dqsl19nwvh6u	Alameda	Sanasa St		Davao City	Philippines	8000	2024-11-25 22:19:49.783	cm3xlccv50005dqsl2h64wceq	t	f	\N	Test for Vendor registration under Sign Up Page	2024-11-25 22:19:49.783	Main Address
cm2c6cof50002r6dh1w0vx85w	\N	123 Main St		San Carlos	CA	94070	2024-10-16 17:57:18.113	\N	f	f	\N	\N	2024-10-16 17:57:18.113	Main Address
cm2c6q9870007r6dhqcl42dxq	\N	123 Main St		San Carlos	CA	94070	2024-10-16 18:07:51.606	\N	f	f	\N	\N	2024-10-16 18:07:51.606	Main Address
cm2ce3ofq0002jk45h926qdco	\N	1120 Eaton Av Apt 10		San Carlos	California	94070	2024-10-16 21:34:15.159	cm2ce3o5k0000jk45dtqvtcsv	f	f	\N	\N	2024-10-16 21:34:15.159	Main Address
cm3xlz39y0002f1mrq3qbteyi	Alameda	Sanasa St		Davao CIty	Philippines	90210	2024-11-25 22:37:30.07	cm3xlz2zf0000f1mrugdw9sko	f	f	\N	Test for the Client Sign Up page	2024-11-25 22:37:30.07	Main Address
cm2c6z5gw000cr6dhritcpgbk	\N	123 Main St		San Carlos	CA	94070	2024-10-16 18:14:46.639	\N	f	f	\N	\N	2024-10-16 18:14:46.639	Main Address
cm25eb75g0001u0kuxxdy7947	San Mateo	834 Macon Road  CA 		Mountain View 	CA	94043	2024-10-12 00:05:42.69	\N	f	f	650-123-1212	n/a	2024-10-12 00:05:42.69	LTA Research - John Thung
cm2cepn2h0002pt1u2xq0xvv7	\N	17 Riverside St		Millbrae	California	94080	2024-10-16 21:51:19.817	\N	f	f	\N	\N	2024-10-16 21:51:19.817	Main Address
cm3yym2m2000210t4sxygpv01	\N	Agabus Street		Dala City	California	94014	2024-11-26 21:19:03.867	cm3yym2bd000010t4ljfvz2kc	f	f	\N	\N	2024-11-26 21:19:03.867	Main Address
cm405b3tc0002icplu2vm76x5	Alameda	Sanasa St		Davao CIty	Philippines	8000	2024-11-27 17:14:15.696	cm405b3ix0000icpl180rrsb3	t	f	\N		2024-11-27 17:14:15.696	Main Address
cm407k5kz000234gtb9ns9z56	Alameda	Sanasa St		Davao CIty	Philippines	8000	2024-11-27 18:17:17.124	cm407k5a4000034gtqi97ttn6	t	f	\N		2024-11-27 18:17:17.124	Main Address
cm2q9pjeg0002m95sob0vaqgn	\N	2660 Royal Ann dr		Union City	CA	94587	2024-10-26 14:40:03.449	cm2q9pj4j0000m95sb6fqm567	f	f	\N	\N	2024-10-26 14:40:03.449	Main Address
cm4d1cu970002lqgvhikgsdza	San Francisco	103 Horne Avenue, San Francisco, CA, 		Daly	California	94124	2024-12-06 17:44:38.444	cm4d1ctys0000lqgv4yzimj95	f	f	\N		2024-12-06 17:44:38.444	Main Address
cm4d2xa8d0002bjtxzc7olo86	San Francisco	595 Alabama St, 		San Francisco	United States	94110	2024-12-06 18:28:31.886	cm4d2x9xy0000bjtxb71cwwf9	t	f	\N	Yes	2024-12-06 18:28:31.886	Main Address
cm4c05kvd000269n0w5ff37rp	\N	123 Main St		San Carlos	CA	94070	2024-12-06 00:23:13.897	\N	f	f	\N	\N	2024-12-06 00:23:13.897	Main Address
cm1r4rleh0003g1n0c6pf7e38	Santa Clara	111 Lytton Avenue   	\N	Palo Alto	CA	94301	2024-10-02 00:29:45.109	cm4d2x9xy0000bjtxb71cwwf9	t	t	650-741-0713	\N	2024-12-06 20:47:25.092	Coupa Cafe - Palo Alto
cm2l0ue2g0001er97a3lutoyg	Santa Clara	2423 Old Middlefield Way 	\N	Mountain View 	CA	94043 	2024-10-22 22:33:02.39	cm1fkjwho00009vg82l7w8bl8	t	t	\N	\N	2024-10-28 19:21:34.552	Bajis Cafe
cm4ir4luj0002562zsmixr3va	\N	Sanasa St		Davao CIty	Philippines	8000	2024-12-10 17:44:55.196	cm4ir4ljx0000562z3htnuy0a	f	f	\N	\N	2024-12-10 17:44:55.196	Main Address
cm1r4t3sj0005g1n04u5ujuzf	Santa Clara	834 Macon Road   	\N	Mountain View	CA	94043	2024-10-02 00:30:55.519	cm1fkjwho00009vg82l7w8bl8	f	f	\N	\N	2024-10-28 19:21:34.552	LTA Research - John Thung
cm2vcikbd000212765jempy0t	\N	33 8th St	1704	San Francisco	CA	94103	2024-10-30 03:57:27.77	cm2vcik0o00001276nfupzx52	f	f	\N	\N	2024-10-30 03:57:27.77	Main Address
cm3tvokq500028clnjnulaudw	\N	620 Iris Ave	432	Sunnyvale	CA	94086	2024-11-23 07:58:10.925	cm3tvokg200008cln9d5j05xf	f	f	\N	\N	2024-11-23 07:58:10.925	Main Address
cm2c8htkg000214nrxs5ssztt	\N	123 Main St		San Carlos	CA	94070	2024-10-16 18:57:17.296	\N	f	f	\N	\N	2024-10-16 18:57:17.296	Main Address
cm3xhq0k80002xexiecw8tc4s	\N	123 Main St		San Carlos	CA	94070	2024-11-25 20:38:28.184	\N	f	f	\N	\N	2024-11-25 20:38:28.184	Main Address
cm4a6bnwc0002cxmc36wi4xen	\N	123 Main St		San Carlos	CA	94070	2024-12-04 17:40:23.101	\N	f	f	\N	\N	2024-12-04 17:40:23.101	Main Address
cm5psyzmt0002js0302c1wt8f	\N	DDF Village 		Davao 	Philippines	8000	2025-01-09 20:50:37.925	cm5psyzdk0000js03ngzaqmmc	f	f	\N	\N	2025-01-09 20:50:37.925	Main Address
cm6ebij8g0002l503tzh3v6qt	San Francisco	Purok 7, Bongabong		Pantukan	Davao De Oro	8809	2025-01-27 00:36:11.104	cm6ebiiyv0000l503g002yn62	t	f	\N	N/A	2025-01-27 00:36:11.104	Main Address
cm6ebo9gn0002jx03lr65eza6	San Francisco	Purok 7, Bongabong		Pantukan	Davao De Oro	94105	2025-01-27 00:40:38.375	cm6ebo97x0000jx03p5fweiwi	f	f	\N	N/A	2025-01-27 00:40:38.375	Main Address
cm6edfok50002if03votmde3r	\N	1033  	Irving Street	San Francisco	California	94122 	2025-01-27 01:29:57.27	cm6edfobg0000if03hllik9gg	f	f	\N	\N	2025-01-27 01:29:57.27	Main Address
cm6f5cinu0002l503zi1gn46t	Alameda	1101 Shoreway Road		Belmont	CA	94002	2025-01-27 14:31:18.907	cm6f5cied0000l5037q35goed	t	f	\N		2025-01-27 14:31:18.907	Main Address
cm6f5fyz70007l5031dx4if3i	Alameda	5501 Balcones Drive		Austin	TX	78731	2025-01-27 14:34:00.02	cm6f5fypt0005l5037w379f9b	f	f	\N		2025-01-27 14:34:00.02	Main Address
cm6f5hyk4000cl503uhxj4kme	\N	115 E Santa Clara St		San Jose	CA	95113	2025-01-27 14:35:32.788	cm6f5hyaz000al5035pehzy6s	f	f	\N	\N	2025-01-27 14:35:32.788	Main Address
cm6f5r3ut000hl503z51048nz	\N	2100 Geng Rd\t		Palo Alto	California	94303	2025-01-27 14:42:39.557	cm6f5r3lx000fl503pmm7nwra	f	f	\N	\N	2025-01-27 14:42:39.557	Main Address
cm6f5xxyu0002l503ht8ihxn9	\N	560 Alabama St		San Francisco	California	94110	2025-01-27 14:47:58.518	cm6f5xxps0000l50314zhxw6r	f	f	\N	\N	2025-01-27 14:47:58.518	Main Address
cm6fbag6o0002l5036iiw081f	San Mateo	Test 		Test 	Test 	Test 	2025-01-27 17:17:40.08	cm6fbafxc0000l503ln5qbpo0	t	f	\N		2025-01-27 17:17:40.08	Main Address
cm6fbolm50002jy03wg1hahe8	San Mateo	Test		Test	Test	90210	2025-01-27 17:28:40.301	cm6fbolcp0000jy03ba7unntt	f	f	\N		2025-01-27 17:28:40.301	Main Address
cm6fc2mh20002jy03063p9m3i	\N	Test		Test	Test	Test	2025-01-27 17:39:34.598	cm6fc2m7t0000jy03mklj818r	f	f	\N	\N	2025-01-27 17:39:34.598	Main Address
cm6fc8pda0002ib03kh199a6p	\N	Test		Test	Test	Test	2025-01-27 17:44:18.286	cm6fc8p410000ib03dqmq94im	f	f	\N	\N	2025-01-27 17:44:18.286	Main Address
cm6fezuzu0002l103dpqf4nvj	Alameda	2355 Broadway		Oakland	California	94612	2025-01-27 19:01:24.522	cm6fezuqp0000l103xrxsm6d7	t	f	\N		2025-01-27 19:01:24.522	Main Address
cm6ff3vjf0007l1039naad5r4	San Francisco	851 Main St		Redwood City	 California	94063	2025-01-27 19:04:31.852	cm6ff3val0005l103n9t0um4c	f	f	\N		2025-01-27 19:04:31.852	Main Address
cm6gmrj040002i903wxaz2r6a	Alameda	1 King Street	Unit 6	New York	New York	10012 	2025-01-28 15:26:38.836	cm6gmriqw0000i9035vukh3s2	t	f	\N		2025-01-28 15:26:38.836	Main Address
cm6gmxjsm0007i903u6u7ucmy	Contra Costa	Summer Street		Stamford	Connecticut	06905	2025-01-28 15:31:19.799	cm6gmxjjn0005i90389uzug9h	f	f	\N		2025-01-28 15:31:19.799	Main Address
\.



-- Re-enable all triggers
DO $$
DECLARE
  table_record RECORD;
BEGIN
  FOR table_record IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE 'ALTER TABLE ' || quote_ident(table_record.tablename) || ' ENABLE TRIGGER ALL';
  END LOOP;
END $$;


--
-- PostgreSQL database dump complete
--