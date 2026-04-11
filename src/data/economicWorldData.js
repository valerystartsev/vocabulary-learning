/**
 * Economic World in Words — Adaptation Course
 * Each profile: subtitle, 3-word vocabulary lens, why-fit explanation,
 * one real competition/antitrust case with source, and one mini interaction.
 */

export const PROFILES = [
  {
    id: 'usa',
    name: 'United States',
    region: 'North America',
    subtitle: 'A large competitive market with strong antitrust regulation and global business influence.',
    lat: 38.9,
    lng: -77.0,
    active: true,

    vocabLens: ['competition', 'monopoly', 'merger'],
    whyFit: 'The United States has some of the most well-known antitrust cases in the world. Large technology companies are regularly investigated for monopoly power and for using mergers to remove competitors. These three words appear directly in US court decisions and regulator reports, making them easy to understand through real American market examples.',

    competitionCase: {
      title: 'FTC v. Meta Platforms (Instagram & WhatsApp)',
      summary: 'The US Federal Trade Commission (FTC) accused Meta of maintaining a monopoly in personal social networking by acquiring Instagram and WhatsApp to eliminate competing platforms. The FTC argued that Meta used these mergers to prevent competition rather than to improve services for users.',
      vocabConnection: 'This case makes the words monopoly, merger, and competition directly visible: Meta\'s mergers reduced competition, and the FTC argued this created illegal monopoly power.',
      sourceUrl: 'https://www.ftc.gov/legal-library/browse/cases-proceedings/191-0134-facebook-inc-ftc-v',
      sourceLabel: 'FTC — FTC v. Meta Platforms (official case page)',
    },

    interaction: {
      type: 'choice',
      q: 'The FTC accused Meta of using mergers to reduce ______ in social networking.',
      options: ['overheads', 'competition', 'recruitment', 'procedures'],
      answer: 'competition',
      explanation: 'The FTC argued that Meta\'s acquisitions eliminated rivals and reduced competition in the market.',
    },
  },

  {
    id: 'uk',
    name: 'United Kingdom',
    region: 'Western Europe',
    subtitle: 'A major economy with an independent competition regulator and active merger review.',
    lat: 51.5,
    lng: -0.12,
    active: true,

    vocabLens: ['competition', 'merger', 'restrict'],
    whyFit: 'The United Kingdom\'s Competition and Markets Authority (CMA) regularly reviews large mergers to decide whether they restrict competition. The word "restrict" is particularly relevant because the CMA can block or restrict mergers that it believes will harm consumers. These three words capture how the UK market regulator thinks and acts.',

    competitionCase: {
      title: 'CMA Review: Microsoft / Activision Blizzard Merger',
      summary: 'The UK Competition and Markets Authority investigated whether Microsoft\'s acquisition of Activision Blizzard would restrict competition in cloud gaming. In 2023, the CMA initially blocked the deal before approving a restructured version that addressed concerns about market control in cloud gaming services.',
      vocabConnection: 'This case shows how regulators use the words merger and restrict together: a merger can restrict competition, and the authority can restrict or block that merger to protect the market.',
      sourceUrl: 'https://www.gov.uk/cma-cases/microsoft-activision-blizzard-merger-inquiry',
      sourceLabel: 'CMA — Microsoft / Activision Blizzard Merger Inquiry (official)',
    },

    interaction: {
      type: 'trueFalse',
      q: 'True or False: The CMA can restrict or block a merger if it believes competition will be harmed.',
      answer: true,
      explanation: 'Correct — the CMA\'s role is to review mergers and restrict those that could reduce competition and harm consumers.',
    },
  },

  {
    id: 'eu',
    name: 'European Union',
    region: 'Europe (Regional)',
    subtitle: 'A major regulatory body that handles competition law across many national markets.',
    lat: 50.85,
    lng: 4.35,
    active: true,

    vocabLens: ['monopoly', 'competition', 'restrict'],
    whyFit: 'The European Commission is one of the most active competition regulators in the world. It investigates large companies that use their dominant position — effectively a form of monopoly power — to restrict competition. The EU vocabulary of "dominant position", "restrict", and "competition" maps directly onto the course words students already know.',

    competitionCase: {
      title: 'European Commission — Apple App Store Anti-Steering Decision',
      summary: 'In 2024, the European Commission found that Apple had abused its dominant position in the iOS app distribution market. Apple restricted app developers from directing users to cheaper alternatives outside the App Store. The Commission fined Apple €1.8 billion for these anti-steering rules that limited competition.',
      vocabConnection: 'This case directly demonstrates the words monopoly (dominant position), restrict (Apple\'s anti-steering rules), and competition (what Apple prevented developers from using).',
      sourceUrl: 'https://ec.europa.eu/commission/presscorner/detail/en/ip_24_1161',
      sourceLabel: 'European Commission — Apple App Store Decision, March 2024 (official press release)',
    },

    interaction: {
      type: 'choice',
      q: 'The European Commission found that Apple used its dominant position to ______ competition.',
      options: ['improve', 'authorize', 'restrict', 'recruit'],
      answer: 'restrict',
      explanation: 'Apple\'s rules prevented developers from directing users to cheaper options, which restricted competition in the app market.',
    },
  },

  {
    id: 'germany',
    name: 'Germany',
    region: 'Central Europe',
    subtitle: 'A strong industrial economy with an active national competition authority.',
    lat: 52.5,
    lng: 13.4,
    active: true,

    vocabLens: ['enterprise', 'competitive', 'merger'],
    whyFit: 'Germany has one of the most respected competition authorities in Europe — the Bundeskartellamt. German market policy strongly supports the idea that enterprises must remain competitive and that mergers should not concentrate power in too few hands. These three words fit because German competition law centres on protecting competitive enterprise from harmful consolidation.',

    competitionCase: {
      title: 'Bundeskartellamt — Meta (Facebook) Data Processing Decision',
      summary: 'Germany\'s Bundeskartellamt ruled that Meta was abusing its dominant market position by combining user data from Facebook, Instagram, and WhatsApp without proper consent. The authority found that Meta\'s data practices gave it an unfair competitive advantage over smaller enterprises that could not access equivalent data volumes.',
      vocabConnection: 'This case shows how a dominant enterprise can use data to become more competitive in ways that harm other market participants — connecting the words enterprise, competitive, and merger to real regulatory thinking.',
      sourceUrl: 'https://www.bundeskartellamt.de/EN/NewsMerkblatt/Pressemitteilungen/2023_Pressemitteilungen/2023_01_06_Meta.html',
      sourceLabel: 'Bundeskartellamt — Meta Data Decision, January 2023 (official)',
    },

    interaction: {
      type: 'trueFalse',
      q: 'True or False: In this German case, Meta\'s data practices gave it a competitive advantage over smaller enterprises.',
      answer: true,
      explanation: 'Correct — the Bundeskartellamt argued that Meta\'s data combination was an unfair competitive advantage that smaller enterprises could not match.',
    },
  },

  {
    id: 'france',
    name: 'France',
    region: 'Western Europe',
    subtitle: 'A large European market with an independent competition authority and active tech regulation.',
    lat: 48.85,
    lng: 2.35,
    active: true,

    vocabLens: ['enterprise', 'competition', 'restrict'],
    whyFit: 'France\'s Autorité de la concurrence regularly acts against large enterprises that restrict competition in the French market. France has been particularly active in technology-sector competition cases. The words enterprise, competition, and restrict are directly visible in how French competition law describes market abuse by dominant companies.',

    competitionCase: {
      title: 'Autorité de la concurrence — Apple Fine for Competition Restrictions (Mobile Advertising)',
      summary: 'In 2021, France\'s competition authority fined Apple €1.1 billion for anti-competitive practices in the mobile advertising ecosystem. Apple\'s App Tracking Transparency framework was found to impose stricter consent rules on third-party apps than on Apple\'s own apps, restricting fair competition between enterprises in mobile advertising.',
      vocabConnection: 'This case shows how a large enterprise can restrict competition by applying different rules to itself versus other market participants — directly connecting the course words enterprise, restrict, and competition.',
      sourceUrl: 'https://www.autoritedelaconcurrence.fr/en/press-release/autorite-de-la-concurrence-fines-apple-11-billion-euros-competition-rules-mobile',
      sourceLabel: 'Autorité de la concurrence — Apple Fine Decision (official press release)',
    },

    interaction: {
      type: 'choice',
      q: 'Which word best describes what Apple was found to have done to competition in this French case?',
      options: ['authorised', 'recruited', 'restricted', 'fluctuated'],
      answer: 'restricted',
      explanation: 'Apple restricted fair competition by applying stricter rules to rival enterprises than to its own services.',
    },
  },

  {
    id: 'japan',
    name: 'Japan',
    region: 'East Asia',
    subtitle: 'A highly organised market economy with formal business procedures and competition law.',
    lat: 35.68,
    lng: 139.69,
    active: true,

    vocabLens: ['procedure', 'enterprise', 'competition'],
    whyFit: 'Japan\'s business culture is strongly associated with formal procedures and structured market rules. The Japan Fair Trade Commission (JFTC) enforces competition law through defined procedures, and Japanese enterprises operate within carefully regulated markets. These three words capture how Japanese market regulation works in practice.',

    competitionCase: {
      title: 'JFTC — Google Search Agreement with Yahoo Japan',
      summary: 'In 2023, Japan\'s Fair Trade Commission (JFTC) reviewed whether Google\'s search agreement with Yahoo Japan was reducing competition in the Japanese search market. The JFTC concluded that the agreement, under which Yahoo Japan used Google\'s search technology, required Google to follow specific procedures to ensure competition was maintained and that other search enterprises were not unfairly excluded.',
      vocabConnection: 'This case connects the words procedure (the JFTC set formal procedures Google must follow), enterprise (both Google and Yahoo Japan are major enterprises), and competition (the core concern of the investigation).',
      sourceUrl: 'https://www.jftc.go.jp/en/pressreleases/yearly-2023/October/231023.html',
      sourceLabel: 'JFTC — Google Search Agreement Decision, October 2023 (official)',
    },

    interaction: {
      type: 'trueFalse',
      q: 'True or False: The JFTC required Google to follow specific procedures to protect competition in the Japanese market.',
      answer: true,
      explanation: 'Correct — the JFTC set out formal procedures that Google had to follow to ensure the search market remained competitive.',
    },
  },

  {
    id: 'southkorea',
    name: 'South Korea',
    region: 'East Asia',
    subtitle: 'A dynamic technology-driven economy with active antitrust enforcement.',
    lat: 37.57,
    lng: 126.98,
    active: true,

    vocabLens: ['competition', 'monopoly', 'restrict'],
    whyFit: 'South Korea\'s Korea Fair Trade Commission (KFTC) has been active in major global antitrust cases. South Korea is a major producer of technology components, and questions of monopoly and competition in semiconductor and platform markets are central to its economic policy. These three words map directly onto how the KFTC investigates and describes market abuse.',

    competitionCase: {
      title: 'KFTC — Qualcomm Antitrust Decision',
      summary: 'South Korea\'s Fair Trade Commission fined Qualcomm over 1 trillion Korean won (approximately $865 million USD) in 2016 for abusing its monopoly position in mobile chipsets. Qualcomm was found to have restricted competition by tying its patent licences to chip supply agreements, preventing manufacturers from using competing chip suppliers.',
      vocabConnection: 'This case makes the words monopoly (Qualcomm\'s dominant market position), restrict (tying agreements that prevented competitors), and competition (what was harmed) directly visible in a real KFTC ruling.',
      sourceUrl: 'https://www.ftc.go.kr/solution/skin/doc.html?fn=1480561817609_20161128105657.pdf&rs=/fileupload/data/result/BBSMSTR_000000002405/',
      sourceLabel: 'KFTC — Qualcomm Antitrust Decision Summary (official document)',
    },

    interaction: {
      type: 'choice',
      q: 'The KFTC found that Qualcomm used its monopoly position to ______ competition in mobile chipsets.',
      options: ['support', 'recruit', 'restrict', 'fluctuate'],
      answer: 'restrict',
      explanation: 'Qualcomm tied its licences to chip supply agreements, which restricted other companies from competing fairly.',
    },
  },

  {
    id: 'india',
    name: 'India',
    region: 'South Asia',
    subtitle: 'One of the world\'s fastest-growing major economies with active digital market regulation.',
    lat: 28.6,
    lng: 77.2,
    active: true,

    vocabLens: ['competition', 'monopoly', 'enterprise'],
    whyFit: 'India\'s Competition Commission of India (CCI) has become increasingly active, especially in digital markets. India is home to a large and growing number of technology enterprises, and questions of market dominance are central to economic policy. These three words fit because India\'s antitrust work is mainly about protecting competition between enterprises in fast-growing digital and platform markets.',

    competitionCase: {
      title: 'CCI — Google Android Antitrust Decision',
      summary: 'India\'s Competition Commission fined Google ₹1,337.76 crore (approximately $162 million USD) in 2022 for abusing its dominant position in the Android mobile device ecosystem. The CCI found that Google forced device manufacturers to pre-install Google apps and restricted manufacturers from using alternative versions of Android, harming competition between enterprises in the mobile market.',
      vocabConnection: 'This case shows how a company with monopoly-level dominance can restrict competition for other enterprises — directly connecting the three course words to a real regulatory decision.',
      sourceUrl: 'https://cci.gov.in/antitrust/orders/details/1875/0',
      sourceLabel: 'CCI — Google Android Decision, October 2022 (official order)',
    },

    interaction: {
      type: 'trueFalse',
      q: 'True or False: The CCI found that Google\'s practices harmed competition between enterprises in the mobile market.',
      answer: true,
      explanation: 'Correct — the CCI ruled that Google restricted manufacturers from using competing systems, which harmed competition and other enterprises.',
    },
  },

  {
    id: 'china',
    name: 'China',
    region: 'East Asia',
    subtitle: 'The world\'s largest manufacturing economy, with growing antitrust enforcement.',
    lat: 39.9,
    lng: 116.4,
    active: true,

    vocabLens: ['enterprise', 'monopoly', 'restrict'],
    whyFit: 'China\'s State Administration for Market Regulation (SAMR) has become an active antitrust authority, particularly targeting large domestic platform enterprises. China\'s market has both state-owned and private enterprises, and questions of monopoly power and market restriction are central to current economic policy. These three words capture how Chinese regulators are reshaping competition rules for the digital economy.',

    competitionCase: {
      title: 'SAMR — Alibaba Antitrust Decision',
      summary: 'In 2021, China\'s State Administration for Market Regulation fined Alibaba 18.228 billion yuan (approximately $2.75 billion USD) for abusing its monopoly position in the Chinese e-commerce market. SAMR found that Alibaba had used "choose one of two" exclusivity requirements, restricting merchants from selling on competing platforms and limiting competition in online retail.',
      vocabConnection: 'This is one of the largest antitrust fines in history for monopoly abuse. It directly shows the words enterprise (Alibaba as a dominant enterprise), monopoly (its market position), and restrict (the exclusivity rules it imposed).',
      sourceUrl: 'https://www.samr.gov.cn/hd/zjdc/202104/t20210410_327702.html',
      sourceLabel: 'SAMR — Alibaba Antitrust Decision, April 2021 (official)',
    },

    interaction: {
      type: 'choice',
      q: 'Alibaba was fined for using monopoly power to ______ merchants from selling on other platforms.',
      options: ['authorize', 'recruit', 'restrict', 'deal'],
      answer: 'restrict',
      explanation: 'Alibaba\'s "choose one of two" rules restricted merchants from using competing platforms, which the SAMR ruled was an abuse of monopoly power.',
    },
  },
];