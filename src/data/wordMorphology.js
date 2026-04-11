// Centralized IPA transcription + morphological data for all vocabulary entries.
// Standard: Cambridge/Oxford UK IPA. One source of truth for Dictionary, Glossary, and all word cards.
//
// Structure per entry:
//   ipa: string — IPA transcription
//   noun: { plural: string } | { countability: string }  (for noun POS)
//   verb: { base, third, pastSimple, pastParticiple, ing }  (for verb POS)
//   Words tagged "noun / verb" have BOTH noun and verb keys.

export const wordMorphology = {

  // ─── UNIT 1 ─────────────────────────────────────────────────────────────────

  u1_accept: {
    ipa: '/əkˈsept/',
    verb: { base: 'accept', third: 'accepts', pastSimple: 'accepted', pastParticiple: 'accepted', ing: 'accepting' },
  },

  u1_acceptance: {
    ipa: '/əkˈsep.təns/',
    noun: { plural: 'acceptances' },
  },

  u1_affect: {
    ipa: '/əˈfekt/',
    verb: { base: 'affect', third: 'affects', pastSimple: 'affected', pastParticiple: 'affected', ing: 'affecting' },
  },

  u1_authorize: {
    ipa: '/ˈɔː.θər.aɪz/',
    verb: { base: 'authorize', third: 'authorizes', pastSimple: 'authorized', pastParticiple: 'authorized', ing: 'authorizing' },
  },

  u1_authority: {
    ipa: '/ɔːˈθɒr.ɪ.ti/',
    noun: { plural: 'authorities' },
  },

  u1_breakeven: {
    ipa: '/breɪk ˈiː.vən/',
    verb: { base: 'break even', third: 'breaks even', pastSimple: 'broke even', pastParticiple: 'broken even', ing: 'breaking even' },
  },

  u1_breakevenpoint: {
    ipa: '/ˈbreɪk.iː.vən pɔɪnt/',
    noun: { plural: 'break-even points' },
  },

  u1_cancel: {
    ipa: '/ˈkæn.səl/',
    verb: { base: 'cancel', third: 'cancels', pastSimple: 'cancelled', pastParticiple: 'cancelled', ing: 'cancelling' },
  },

  u1_cause: {
    ipa: '/kɔːz/',
    noun: { plural: 'causes' },
    verb: { base: 'cause', third: 'causes', pastSimple: 'caused', pastParticiple: 'caused', ing: 'causing' },
  },

  u1_communicate: {
    ipa: '/kəˈmjuː.nɪ.keɪt/',
    verb: { base: 'communicate', third: 'communicates', pastSimple: 'communicated', pastParticiple: 'communicated', ing: 'communicating' },
  },

  u1_complain: {
    ipa: '/kəmˈpleɪn/',
    verb: { base: 'complain', third: 'complains', pastSimple: 'complained', pastParticiple: 'complained', ing: 'complaining' },
  },

  u1_complaint: {
    ipa: '/kəmˈpleɪnt/',
    noun: { plural: 'complaints' },
  },

  u1_competition: {
    ipa: '/ˌkɒm.pəˈtɪʃ.ən/',
    // In market context: uncountable. As events: competitions.
    noun: { countability: 'uncountable (general sense)' },
  },

  u1_compete: {
    ipa: '/kəmˈpiːt/',
    verb: { base: 'compete', third: 'competes', pastSimple: 'competed', pastParticiple: 'competed', ing: 'competing' },
  },

  u1_competitive: {
    ipa: '/kəmˈpet.ɪ.tɪv/',
    // adjective — no noun/verb morphology
  },

  u1_damage: {
    ipa: '/ˈdæm.ɪdʒ/',
    noun: { countability: 'uncountable' },
    verb: { base: 'damage', third: 'damages', pastSimple: 'damaged', pastParticiple: 'damaged', ing: 'damaging' },
  },

  u1_deal: {
    ipa: '/diːl/',
    noun: { plural: 'deals' },
    verb: { base: 'deal', third: 'deals', pastSimple: 'dealt', pastParticiple: 'dealt', ing: 'dealing' },
  },

  u1_entitle: {
    ipa: '/ɪnˈtaɪ.təl/',
    verb: { base: 'entitle', third: 'entitles', pastSimple: 'entitled', pastParticiple: 'entitled', ing: 'entitling' },
    derivedForms: [
      {
        form: 'entitled',
        pos: 'adjective',
        translationRu: 'вправе / имеющий право',
        meaningEn: 'Having the right to do or receive something.',
        meaningRu: 'Имеющий право на что-либо; используется в юридических и деловых контекстах.',
        example: 'Customers are entitled to a refund if the product is damaged.',
      }
    ],
  },

  u1_merger: {
    ipa: '/ˈmɜː.dʒər/',
    noun: { plural: 'mergers' },
  },

  u1_monopoly: {
    ipa: '/məˈnɒp.ə.li/',
    noun: { plural: 'monopolies' },
  },

  u1_monopolise: {
    ipa: '/məˈnɒp.ə.laɪz/',
    verb: { base: 'monopolise', third: 'monopolises', pastSimple: 'monopolised', pastParticiple: 'monopolised', ing: 'monopolising' },
  },

  u1_legalmonopoly: {
    ipa: '/ˈliː.ɡəl məˈnɒp.ə.li/',
    noun: { plural: 'legal monopolies' },
  },

  u1_overheads: {
    ipa: '/ˈəʊ.vər.hedz/',
    noun: { countability: 'plural only' },
  },

  u1_permit: {
    ipa: '/ˈpɜː.mɪt/',
    noun: { plural: 'permits' },
    verb: { base: 'permit', third: 'permits', pastSimple: 'permitted', pastParticiple: 'permitted', ing: 'permitting' },
  },

  u1_prevail: {
    ipa: '/prɪˈveɪl/',
    verb: { base: 'prevail', third: 'prevails', pastSimple: 'prevailed', pastParticiple: 'prevailed', ing: 'prevailing' },
  },

  u1_fluctuate: {
    ipa: '/ˈflʌk.tʃu.eɪt/',
    verb: { base: 'fluctuate', third: 'fluctuates', pastSimple: 'fluctuated', pastParticiple: 'fluctuated', ing: 'fluctuating' },
  },

  u1_fluctuation: {
    ipa: '/ˌflʌk.tʃuˈeɪ.ʃən/',
    noun: { plural: 'fluctuations' },
  },

  u1_enterprise: {
    ipa: '/ˈen.tə.praɪz/',
    noun: { plural: 'enterprises' },
  },

  u1_obtain: {
    ipa: '/əbˈteɪn/',
    verb: { base: 'obtain', third: 'obtains', pastSimple: 'obtained', pastParticiple: 'obtained', ing: 'obtaining' },
  },

  u1_negotiate: {
    ipa: '/nɪˈɡəʊ.ʃi.eɪt/',
    verb: { base: 'negotiate', third: 'negotiates', pastSimple: 'negotiated', pastParticiple: 'negotiated', ing: 'negotiating' },
  },

  u1_procedure: {
    ipa: '/prəˈsiː.dʒər/',
    noun: { plural: 'procedures' },
  },

  u1_purchase: {
    ipa: '/ˈpɜː.tʃəs/',
    noun: { plural: 'purchases' },
    verb: { base: 'purchase', third: 'purchases', pastSimple: 'purchased', pastParticiple: 'purchased', ing: 'purchasing' },
  },

  u1_recruitment: {
    ipa: '/rɪˈkruːt.mənt/',
    noun: { countability: 'uncountable' },
  },

  u1_recruit: {
    ipa: '/rɪˈkruːt/',
    noun: { plural: 'recruits' },
    verb: { base: 'recruit', third: 'recruits', pastSimple: 'recruited', pastParticiple: 'recruited', ing: 'recruiting' },
  },

  u1_resume: {
    ipa: '/ˈrez.juː.meɪ/',
    noun: { plural: 'resumes / CVs' },
  },

  u1_circumstances: {
    ipa: '/ˈsɜː.kəm.stæn.sɪz/',
    noun: { countability: 'plural only' },
  },

  u1_subject: {
    ipa: '/ˈsʌb.dʒɪkt/',
    // adjective/verb — show verb forms
    verb: { base: 'subject', third: 'subjects', pastSimple: 'subjected', pastParticiple: 'subjected', ing: 'subjecting' },
  },

  u1_undesirable: {
    ipa: '/ˌʌn.dɪˈzaɪə.rə.bəl/',
    // adjective only
  },

  u1_refund: {
    ipa: '/ˈriː.fʌnd/',
    noun: { plural: 'refunds' },
    verb: { base: 'refund', third: 'refunds', pastSimple: 'refunded', pastParticiple: 'refunded', ing: 'refunding' },
  },

  u1_restrict: {
    ipa: '/rɪˈstrɪkt/',
    verb: { base: 'restrict', third: 'restricts', pastSimple: 'restricted', pastParticiple: 'restricted', ing: 'restricting' },
  },

  u1_control: {
    ipa: '/kənˈtrəʊl/',
    noun: { countability: 'uncountable (general); plural: controls' },
    verb: { base: 'control', third: 'controls', pastSimple: 'controlled', pastParticiple: 'controlled', ing: 'controlling' },
  },

  // ─── UNIT 2 ─────────────────────────────────────────────────────────────────

  u2_amount: {
    ipa: '/əˈmaʊnt/',
    noun: { plural: 'amounts' },
  },

  u2_average: {
    ipa: '/ˈæv.ər.ɪdʒ/',
    noun: { plural: 'averages' },
  },

  u2_benefit: {
    ipa: '/ˈben.ɪ.fɪt/',
    noun: { plural: 'benefits' },
    verb: { base: 'benefit', third: 'benefits', pastSimple: 'benefited', pastParticiple: 'benefited', ing: 'benefiting' },
  },

  u2_bill: {
    ipa: '/bɪl/',
    noun: { plural: 'bills' },
  },

  u2_encourage: {
    ipa: '/ɪnˈkʌr.ɪdʒ/',
    verb: { base: 'encourage', third: 'encourages', pastSimple: 'encouraged', pastParticiple: 'encouraged', ing: 'encouraging' },
  },

  u2_enlist: {
    ipa: '/ɪnˈlɪst/',
    verb: { base: 'enlist', third: 'enlists', pastSimple: 'enlisted', pastParticiple: 'enlisted', ing: 'enlisting' },
  },

  u2_hire: {
    ipa: '/haɪər/',
    verb: { base: 'hire', third: 'hires', pastSimple: 'hired', pastParticiple: 'hired', ing: 'hiring' },
  },

  u2_insurance: {
    ipa: '/ɪnˈʃʊər.əns/',
    noun: { countability: 'uncountable' },
  },

  u2_justify: {
    ipa: '/ˈdʒʌs.tɪ.faɪ/',
    verb: { base: 'justify', third: 'justifies', pastSimple: 'justified', pastParticiple: 'justified', ing: 'justifying' },
  },

  u2_operate: {
    ipa: '/ˈɒp.ər.eɪt/',
    verb: { base: 'operate', third: 'operates', pastSimple: 'operated', pastParticiple: 'operated', ing: 'operating' },
  },

  u2_output: {
    ipa: '/ˈaʊt.pʊt/',
    noun: { countability: 'uncountable / plural: outputs' },
  },

  u2_input: {
    ipa: '/ˈɪn.pʊt/',
    noun: { countability: 'uncountable / plural: inputs' },
  },

  u2_overhead: {
    ipa: '/ˈəʊ.vər.hed/',
    noun: { plural: 'overheads' },
  },

  u2_promote: {
    ipa: '/prəˈməʊt/',
    verb: { base: 'promote', third: 'promotes', pastSimple: 'promoted', pastParticiple: 'promoted', ing: 'promoting' },
  },

  u2_range: {
    ipa: '/reɪndʒ/',
    noun: { plural: 'ranges' },
    verb: { base: 'range', third: 'ranges', pastSimple: 'ranged', pastParticiple: 'ranged', ing: 'ranging' },
  },

  u2_rent: {
    ipa: '/rent/',
    noun: { countability: 'uncountable (general); plural: rents' },
    verb: { base: 'rent', third: 'rents', pastSimple: 'rented', pastParticiple: 'rented', ing: 'renting' },
  },

  u2_rental: {
    ipa: '/ˈren.təl/',
    noun: { plural: 'rentals' },
  },

  u2_replace: {
    ipa: '/rɪˈpleɪs/',
    verb: { base: 'replace', third: 'replaces', pastSimple: 'replaced', pastParticiple: 'replaced', ing: 'replacing' },
  },

  u2_retrain: {
    ipa: '/ˌriːˈtreɪn/',
    verb: { base: 'retrain', third: 'retrains', pastSimple: 'retrained', pastParticiple: 'retrained', ing: 'retraining' },
  },

  u2_returns: {
    ipa: '/rɪˈtɜːnz/',
    noun: { countability: 'plural only' },
  },

  u2_revenue: {
    ipa: '/ˈrev.ən.juː/',
    noun: { countability: 'uncountable' },
  },

  u2_save: {
    ipa: '/seɪv/',
    verb: { base: 'save', third: 'saves', pastSimple: 'saved', pastParticiple: 'saved', ing: 'saving' },
  },

  u2_support: {
    ipa: '/səˈpɔːt/',
    noun: { countability: 'uncountable' },
    verb: { base: 'support', third: 'supports', pastSimple: 'supported', pastParticiple: 'supported', ing: 'supporting' },
  },

  u2_opportunitycost: {
    ipa: '/ˌɒp.əˈtjuː.nɪ.ti kɒst/',
    noun: { plural: 'opportunity costs' },
  },

  u2_redundant: {
    ipa: '/rɪˈdʌn.dənt/',
    // adjective only
  },

  u2_leisure: {
    ipa: '/ˈleʒ.ər/',
    noun: { countability: 'uncountable' },
  },

  u2_economicgrowth: {
    ipa: '/ˌiː.kəˈnɒm.ɪk ɡrəʊθ/',
    noun: { countability: 'uncountable' },
  },

  u2_capitalgoods: {
    ipa: '/ˈkæp.ɪ.təl ɡʊdz/',
    noun: { countability: 'plural only' },
  },

  u2_naturalresources: {
    ipa: '/ˈnætʃ.ər.əl rɪˈzɔː.sɪz/',
    noun: { countability: 'plural only' },
  },

  u2_pollution: {
    ipa: '/pəˈluː.ʃən/',
    noun: { countability: 'uncountable' },
  },

  u2_socialcosts: {
    ipa: '/ˈsəʊ.ʃəl kɒsts/',
    noun: { countability: 'plural only' },
  },

  u2_techadvances: {
    ipa: '/ˌtek.nəˈlɒdʒ.ɪ.kəl ədˈvɑːn.sɪz/',
    noun: { countability: 'plural only' },
  },

  u2_capitalaccumulation: {
    ipa: '/ˈkæp.ɪ.təl əˌkjuː.mjʊˈleɪ.ʃən/',
    noun: { countability: 'uncountable' },
  },
};