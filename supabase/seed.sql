-- Seed v1 (minst 20 norske aktører) - OBS: PLACEHOLDERS

insert into public.locations (name, slug, region) values
('Oslo', 'oslo', 'Oslo'),
('Bergen', 'bergen', 'Vestland'),
('Trondheim', 'trondheim', 'Trøndelag'),
('Stavanger', 'stavanger', 'Rogaland'),
('Tromsø', 'tromso', 'Troms'),
('Kristiansand', 'kristiansand', 'Agder'),
('Drammen', 'drammen', 'Buskerud'),
('Ålesund', 'alesund', 'Møre og Romsdal')
on conflict (slug) do nothing;

insert into public.tags (name, slug, kind) values
('Generativ video', 'generativ-video', 'ai'),
('Generative bilder', 'generative-bilder', 'ai'),
('3D / Motion', '3d-motion', 'capability'),
('Kreativ strategi', 'kreativ-strategi', 'service'),
('Annonseproduksjon', 'annonseproduksjon', 'service'),
('SoMe / Reels', 'some-reels', 'format'),
('AI-voice / lyd', 'ai-voice-lyd', 'ai'),
('VFX', 'vfx', 'capability'),
('Branding', 'branding', 'service'),
('Web / Interaktiv', 'web-interaktiv', 'service')
on conflict (slug) do nothing;

with loc as (select id, slug from public.locations)
insert into public.companies
(name, slug, short_description, description, ai_level, price_level, company_type, website, cover_image, location_id, is_verified, is_placeholder)
values
('Nordic Prompt Studio', 'nordic-prompt-studio','KI-drevet produksjon av reklamefilm og SoMe assets.','Vi lager kommersielle konsepter, generative storyboard, og ferdige leveranser for kampanjer med høy iterasjonstakt.',4,2,'studio','https://example.com','/covers/cover-1.jpg',(select id from loc where slug='oslo'),false,true),
('Vestland Motion Lab', 'vestland-motion-lab','3D, motion og generativ VFX for kampanjer.','Et lite team som kombinerer 3D pipelines med generative modeller for rask prototyping og finishing.',3,3,'produksjon','https://example.com','/covers/cover-2.jpg',(select id from loc where slug='bergen'),false,true),
('Trønder Kreativ', 'tronder-kreativ','Konsept + performance-kreativ med AI-varianter.','Vi hjelper merkevarer å teste flere kreative retninger raskere gjennom AI-assistert produksjon.',3,1,'byrå','https://example.com','/covers/cover-3.jpg',(select id from loc where slug='trondheim'),false,true),
('Stavanger Content Co', 'stavanger-content-co','SoMe-produksjon i volum, med AI-tilpasninger.','Fra shoot til cutdowns, captions og generative B-roll elementer.',2,1,'byrå','https://example.com','/covers/cover-4.jpg',(select id from loc where slug='stavanger'),false,true),
('Arctic Reelmakers', 'arctic-reelmakers','Reels/Shorts med generativ video og AI-voice.','Spesialisert på korte formater og rask levering.',4,2,'studio','https://example.com','/covers/cover-5.jpg',(select id from loc where slug='tromso'),false,true),
('Sørlandet Brand & AI', 'sorlandet-brand-ai','Branding og kampanjeuttrykk med AI-støtte.','Identitet, kampanjeverktøy og asset-bibliotek for moderne team.',2,2,'byrå','https://example.com','/covers/cover-6.jpg',(select id from loc where slug='kristiansand'),false,true),
('Drammen Generativ', 'drammen-generativ','Generative bilder, key visuals og annonsevarianter.','Vi leverer KV + variantpakker for paid social og display.',3,1,'frilans','https://example.com','/covers/cover-1.jpg',(select id from loc where slug='drammen'),false,true),
('Ålesund Visuals', 'alesund-visuals','Produktfilm og VFX med AI-elementer.','AI brukes til previz, rotoscoping og enkelte generative shots.',2,2,'produksjon','https://example.com','/covers/cover-2.jpg',(select id from loc where slug='alesund'),false,true),
('KI Kollektivet', 'ki-kollektivet','Et frilanskollektiv for AI-drevet reklameproduksjon.','Samarbeid på tvers av foto, video, 3D og tekst.',4,2,'kollektiv','https://example.com','/covers/cover-3.jpg',(select id from loc where slug='oslo'),false,true),
('Fjord VFX', 'fjord-vfx','VFX & compositing med AI-støtte.','Rask rotoscoping, cleanup og precomp workflows.',3,3,'studio','https://example.com','/covers/cover-4.jpg',(select id from loc where slug='bergen'),false,true),
('Oslo Creative Ops', 'oslo-creative-ops','Kreativ produksjon som system: maler, varianter, automasjon.','Vi hjelper team å bygge pipeline for høy-output innhold.',3,2,'byrå','https://example.com','/covers/cover-5.jpg',(select id from loc where slug='oslo'),false,true),
('Prompt & Brand', 'prompt-brand','Branding + AI-generert visuelt språk.','Vi lager et konsistent uttrykk på tvers av kanaler.',3,2,'studio','https://example.com','/covers/cover-6.jpg',(select id from loc where slug='oslo'),false,true),
('Bergen Paid Creative', 'bergen-paid-creative','Annonseproduksjon og varianter for performance.','Fokus på testing: mange varianter, rask læring.',2,1,'byrå','https://example.com','/covers/cover-1.jpg',(select id from loc where slug='bergen'),false,true),
('Trondheim AI Audio', 'trondheim-ai-audio','AI-voice, lydlogo og miks for SoMe.','Rask VO og lydpakker.',4,1,'frilans','https://example.com','/covers/cover-2.jpg',(select id from loc where slug='trondheim'),false,true),
('Rogaland Motion', 'rogaland-motion','3D/Motion design med generative elementer.','Fra styleframes til ferdige leveranser.',3,2,'studio','https://example.com','/covers/cover-3.jpg',(select id from loc where slug='stavanger'),false,true),
('Arctic Brand Studio', 'arctic-brand-studio','Branding og kampanjeutvikling i nord.','AI brukt til ideasjon og variants.',2,2,'byrå','https://example.com','/covers/cover-4.jpg',(select id from loc where slug='tromso'),false,true),
('Agder Reelhouse', 'agder-reelhouse','Reels/Shorts produksjon med AI-assistert klipp.','Korte formater for lokale og nasjonale kunder.',2,1,'produksjon','https://example.com','/covers/cover-5.jpg',(select id from loc where slug='kristiansand'),false,true),
('Oslo Gen-3D', 'oslo-gen-3d','3D packshots, generative bakgrunner, motion.','Hybrid pipeline.',4,3,'studio','https://example.com','/covers/cover-6.jpg',(select id from loc where slug='oslo'),false,true),
('Fjord Web & AI', 'fjord-web-ai','Web/interactive + generativt innhold.','Landingssider + AI-genererte assets.',2,2,'byrå','https://example.com','/covers/cover-1.jpg',(select id from loc where slug='bergen'),false,true),
('Norge Creative Freelance', 'norge-creative-freelance','Frilansernettverk for AI-kreativ produksjon.','Kobler behov til riktig kompetanse.',3,0,'frilans','https://example.com','/covers/cover-2.jpg',(select id from loc where slug='oslo'),false,true);
