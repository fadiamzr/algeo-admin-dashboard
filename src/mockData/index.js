// ============================================================
// ALGEO-VERIFY MOCK DATA
// All entities from the UML Class Diagram
// ============================================================

// ─── Wilayas ─────────────────────────────────────────
export const wilayas = [
  { id: 1, code: '01', name_fr: 'Adrar', name_en: 'Adrar' },
  { id: 2, code: '02', name_fr: 'Chlef', name_en: 'Chlef' },
  { id: 3, code: '03', name_fr: 'Laghouat', name_en: 'Laghouat' },
  { id: 4, code: '04', name_fr: 'Oum El Bouaghi', name_en: 'Oum El Bouaghi' },
  { id: 5, code: '05', name_fr: 'Batna', name_en: 'Batna' },
  { id: 6, code: '06', name_fr: 'Béjaïa', name_en: 'Bejaia' },
  { id: 7, code: '09', name_fr: 'Blida', name_en: 'Blida' },
  { id: 8, code: '15', name_fr: 'Tizi Ouzou', name_en: 'Tizi Ouzou' },
  { id: 9, code: '16', name_fr: 'Alger', name_en: 'Algiers' },
  { id: 10, code: '19', name_fr: 'Sétif', name_en: 'Setif' },
  { id: 11, code: '25', name_fr: 'Constantine', name_en: 'Constantine' },
  { id: 12, code: '31', name_fr: 'Oran', name_en: 'Oran' },
  { id: 13, code: '34', name_fr: 'Bordj Bou Arréridj', name_en: 'Bordj Bou Arreridj' },
  { id: 14, code: '35', name_fr: 'Boumerdès', name_en: 'Boumerdes' },
  { id: 15, code: '42', name_fr: 'Tipaza', name_en: 'Tipaza' },
];

// ─── Communes ────────────────────────────────────────
export const communes = [
  { id: 1, name_fr: 'Bab El Oued', name_en: 'Bab El Oued', postalCode: 16006, wilayaId: 9 },
  { id: 2, name_fr: 'Hussein Dey', name_en: 'Hussein Dey', postalCode: 16040, wilayaId: 9 },
  { id: 3, name_fr: 'El Harrach', name_en: 'El Harrach', postalCode: 16200, wilayaId: 9 },
  { id: 4, name_fr: 'Bir Mourad Raïs', name_en: 'Bir Mourad Rais', postalCode: 16014, wilayaId: 9 },
  { id: 5, name_fr: 'Kouba', name_en: 'Kouba', postalCode: 16050, wilayaId: 9 },
  { id: 6, name_fr: 'Es Sénia', name_en: 'Es Senia', postalCode: 31026, wilayaId: 12 },
  { id: 7, name_fr: 'Bir El Djir', name_en: 'Bir El Djir', postalCode: 31024, wilayaId: 12 },
  { id: 8, name_fr: 'El Khroub', name_en: 'El Khroub', postalCode: 25100, wilayaId: 11 },
  { id: 9, name_fr: 'Didouche Mourad', name_en: 'Didouche Mourad', postalCode: 25015, wilayaId: 11 },
  { id: 10, name_fr: 'Sétif Centre', name_en: 'Setif Centre', postalCode: 19000, wilayaId: 10 },
  { id: 11, name_fr: 'El Eulma', name_en: 'El Eulma', postalCode: 19600, wilayaId: 10 },
  { id: 12, name_fr: 'Batna Centre', name_en: 'Batna Centre', postalCode: 5000, wilayaId: 5 },
  { id: 13, name_fr: 'Blida Centre', name_en: 'Blida Centre', postalCode: 9000, wilayaId: 7 },
  { id: 14, name_fr: 'Bouira Centre', name_en: 'Bouira Centre', postalCode: 10000, wilayaId: 8 },
  { id: 15, name_fr: 'Tipaza Centre', name_en: 'Tipaza Centre', postalCode: 42000, wilayaId: 15 },
  { id: 16, name_fr: 'Boumerdès Centre', name_en: 'Boumerdes Centre', postalCode: 35000, wilayaId: 14 },
  { id: 17, name_fr: 'Béjaïa Centre', name_en: 'Bejaia Centre', postalCode: 6000, wilayaId: 6 },
  { id: 18, name_fr: 'Chlef Centre', name_en: 'Chlef Centre', postalCode: 2000, wilayaId: 2 },
];

// ─── Users (Admin accounts) ─────────────────────────
export const users = [
  { id: 'u1', name: 'Yacine Benmoussa', email: 'yacine@algeo.dz', passwordHash: '$2b$10$hashed', role: 'admin', createdAt: '2025-01-15' },
  { id: 'u2', name: 'Amira Khelifi', email: 'amira@algeo.dz', passwordHash: '$2b$10$hashed', role: 'admin', createdAt: '2025-02-20' },
  { id: 'u3', name: 'Karim Zeroual', email: 'karim@algeo.dz', passwordHash: '$2b$10$hashed', role: 'admin', createdAt: '2025-03-10' },
];

// ─── Delivery Agents ────────────────────────────────
export const deliveryAgents = [
  { id: 'da1', companyId: 1001, name: 'Mohamed Benali', email: 'mohamed.b@delivery.dz', role: 'delivery_agent', createdAt: '2025-01-20', totalDeliveries: 142, successRate: 94.3 },
  { id: 'da2', companyId: 1002, name: 'Fatima Zahra Ouali', email: 'fatima.o@delivery.dz', role: 'delivery_agent', createdAt: '2025-02-05', totalDeliveries: 98, successRate: 91.8 },
  { id: 'da3', companyId: 1003, name: 'Ahmed Slimani', email: 'ahmed.s@delivery.dz', role: 'delivery_agent', createdAt: '2025-02-18', totalDeliveries: 215, successRate: 96.7 },
  { id: 'da4', companyId: 1004, name: 'Nadia Boudiaf', email: 'nadia.b@delivery.dz', role: 'delivery_agent', createdAt: '2025-03-01', totalDeliveries: 67, successRate: 88.0 },
  { id: 'da5', companyId: 1005, name: 'Omar Hamdi', email: 'omar.h@delivery.dz', role: 'delivery_agent', createdAt: '2025-03-15', totalDeliveries: 183, successRate: 95.1 },
  { id: 'da6', companyId: 1006, name: 'Samia Mebarki', email: 'samia.m@delivery.dz', role: 'delivery_agent', createdAt: '2025-04-02', totalDeliveries: 124, successRate: 92.7 },
  { id: 'da7', companyId: 1007, name: 'Rachid Tounsi', email: 'rachid.t@delivery.dz', role: 'delivery_agent', createdAt: '2025-04-20', totalDeliveries: 76, successRate: 89.5 },
  { id: 'da8', companyId: 1008, name: 'Lina Hadj', email: 'lina.h@delivery.dz', role: 'delivery_agent', createdAt: '2025-05-10', totalDeliveries: 158, successRate: 97.2 },
];

// ─── Address Verifications ──────────────────────────
export const addressVerifications = [
  { id: 'av1', rawAddress: '12 rue Didouche Mourad, Alger', normalizedAddress: '12 Rue Didouche Mourad, Alger Centre, 16000 Alger', confidenceScore: 0.95, matchDetails: 'Exact match on street and wilaya', riskFlags: [], createdAt: '2026-01-05T09:30:00' },
  { id: 'av2', rawAddress: 'cité 500 logts bt C, hussein dey', normalizedAddress: 'Cité 500 Logements, Bâtiment C, Hussein Dey, 16040 Alger', confidenceScore: 0.82, matchDetails: 'Partial match - building normalized', riskFlags: ['incomplete_address'], createdAt: '2026-01-05T10:15:00' },
  { id: 'av3', rawAddress: 'oran bir el djir', normalizedAddress: 'Bir El Djir, 31024 Oran', confidenceScore: 0.60, matchDetails: 'Commune match only', riskFlags: ['missing_street', 'low_confidence'], createdAt: '2026-01-06T08:00:00' },
  { id: 'av4', rawAddress: '45 boulevard Krim Belkacem, Alger', normalizedAddress: '45 Boulevard Krim Belkacem, Alger Centre, 16000 Alger', confidenceScore: 0.97, matchDetails: 'Full match with street number', riskFlags: [], createdAt: '2026-01-06T14:22:00' },
  { id: 'av5', rawAddress: 'sétif el eulma rue de la liberté', normalizedAddress: 'Rue de la Liberté, El Eulma, 19600 Sétif', confidenceScore: 0.78, matchDetails: 'Street and commune matched', riskFlags: ['missing_number'], createdAt: '2026-01-07T11:45:00' },
  { id: 'av6', rawAddress: 'constantine le khroub', normalizedAddress: 'El Khroub, 25100 Constantine', confidenceScore: 0.55, matchDetails: 'Commune level only', riskFlags: ['missing_street', 'low_confidence'], createdAt: '2026-01-08T16:00:00' },
  { id: 'av7', rawAddress: 'blida centre ville', normalizedAddress: 'Centre Ville, 9000 Blida', confidenceScore: 0.65, matchDetails: 'Vague address - centre ville', riskFlags: ['vague_address'], createdAt: '2026-01-09T09:10:00' },
  { id: 'av8', rawAddress: '3 rue des frères Bouadou, Bir Mourad Rais, Alger', normalizedAddress: '3 Rue des Frères Bouadou, Bir Mourad Raïs, 16014 Alger', confidenceScore: 0.93, matchDetails: 'High confidence match', riskFlags: [], createdAt: '2026-01-10T12:30:00' },
  { id: 'av9', rawAddress: 'tizi ouzou lguer', normalizedAddress: 'Tizi Ouzou', confidenceScore: 0.35, matchDetails: 'Only wilaya detected - unrecognized commune', riskFlags: ['unrecognized_commune', 'very_low_confidence'], createdAt: '2026-01-11T07:55:00' },
  { id: 'av10', rawAddress: '23a lot communal kouba alger', normalizedAddress: '23A Lotissement Communal, Kouba, 16050 Alger', confidenceScore: 0.88, matchDetails: 'Good match with lot type normalized', riskFlags: [], createdAt: '2026-01-12T15:20:00' },
  { id: 'av11', rawAddress: 'cité universitaire, setif centre', normalizedAddress: 'Cité Universitaire, Sétif Centre, 19000 Sétif', confidenceScore: 0.91, matchDetails: 'Matched with known landmark', riskFlags: [], createdAt: '2026-01-13T10:00:00' },
  { id: 'av12', rawAddress: 'boumerdes centre rue principale', normalizedAddress: 'Rue Principale, Boumerdès Centre, 35000 Boumerdès', confidenceScore: 0.74, matchDetails: 'Generic street name', riskFlags: ['generic_street_name'], createdAt: '2026-01-14T13:40:00' },
  { id: 'av13', rawAddress: 'tipaza hadjout', normalizedAddress: 'Hadjout, 42000 Tipaza', confidenceScore: 0.68, matchDetails: 'Commune level match', riskFlags: ['missing_street'], createdAt: '2026-01-15T08:25:00' },
  { id: 'av14', rawAddress: '7 cité mokhtar bouchama bab el oued', normalizedAddress: '7 Cité Mokhtar Bouchama, Bab El Oued, 16006 Alger', confidenceScore: 0.90, matchDetails: 'Known cité - good match', riskFlags: [], createdAt: '2026-01-16T17:10:00' },
  { id: 'av15', rawAddress: 'adresse inconnue quelque part', normalizedAddress: '', confidenceScore: 0.10, matchDetails: 'No entities detected', riskFlags: ['unresolvable', 'very_low_confidence', 'no_entities'], createdAt: '2026-01-17T06:30:00' },
];

// ─── Verification Records ───────────────────────────
export const verificationRecords = [
  { id: 'vr1', verificationDate: '2026-01-05', resultScore: 0.95, verificationId: 'av1' },
  { id: 'vr2', verificationDate: '2026-01-05', resultScore: 0.82, verificationId: 'av2' },
  { id: 'vr3', verificationDate: '2026-01-06', resultScore: 0.60, verificationId: 'av3' },
  { id: 'vr4', verificationDate: '2026-01-06', resultScore: 0.97, verificationId: 'av4' },
  { id: 'vr5', verificationDate: '2026-01-07', resultScore: 0.78, verificationId: 'av5' },
  { id: 'vr6', verificationDate: '2026-01-08', resultScore: 0.55, verificationId: 'av6' },
  { id: 'vr7', verificationDate: '2026-01-09', resultScore: 0.65, verificationId: 'av7' },
  { id: 'vr8', verificationDate: '2026-01-10', resultScore: 0.93, verificationId: 'av8' },
  { id: 'vr9', verificationDate: '2026-01-11', resultScore: 0.35, verificationId: 'av9' },
  { id: 'vr10', verificationDate: '2026-01-12', resultScore: 0.88, verificationId: 'av10' },
  { id: 'vr11', verificationDate: '2026-01-13', resultScore: 0.91, verificationId: 'av11' },
  { id: 'vr12', verificationDate: '2026-01-14', resultScore: 0.74, verificationId: 'av12' },
  { id: 'vr13', verificationDate: '2026-01-15', resultScore: 0.68, verificationId: 'av13' },
  { id: 'vr14', verificationDate: '2026-01-16', resultScore: 0.90, verificationId: 'av14' },
  { id: 'vr15', verificationDate: '2026-01-17', resultScore: 0.10, verificationId: 'av15' },
];

// ─── Deliveries ─────────────────────────────────────
export const deliveries = [
  { id: 'd1', status: 'delivered', scheduledDate: '2026-01-06', agentId: 'da1', addressVerificationId: 'av1', clientName: 'Ali Mansouri', clientPhone: '+213 555 123 456' },
  { id: 'd2', status: 'delivered', scheduledDate: '2026-01-06', agentId: 'da2', addressVerificationId: 'av2', clientName: 'Sara Bouzid', clientPhone: '+213 555 234 567' },
  { id: 'd3', status: 'failed', scheduledDate: '2026-01-07', agentId: 'da3', addressVerificationId: 'av3', clientName: 'Kamel Khedim', clientPhone: '+213 555 345 678' },
  { id: 'd4', status: 'delivered', scheduledDate: '2026-01-07', agentId: 'da1', addressVerificationId: 'av4', clientName: 'Meriem Hadji', clientPhone: '+213 555 456 789' },
  { id: 'd5', status: 'pending', scheduledDate: '2026-01-08', agentId: 'da4', addressVerificationId: 'av5', clientName: 'Rachid Aït Ali', clientPhone: '+213 555 567 890' },
  { id: 'd6', status: 'failed', scheduledDate: '2026-01-09', agentId: 'da5', addressVerificationId: 'av6', clientName: 'Nassima Zoubir', clientPhone: '+213 555 678 901' },
  { id: 'd7', status: 'delivered', scheduledDate: '2026-01-10', agentId: 'da3', addressVerificationId: 'av8', clientName: 'Sofiane Talbi', clientPhone: '+213 555 789 012' },
  { id: 'd8', status: 'pending', scheduledDate: '2026-01-11', agentId: 'da6', addressVerificationId: 'av9', clientName: 'Houria Benslimane', clientPhone: '+213 555 890 123' },
  { id: 'd9', status: 'delivered', scheduledDate: '2026-01-12', agentId: 'da7', addressVerificationId: 'av10', clientName: 'Mourad Belkadi', clientPhone: '+213 555 901 234' },
  { id: 'd10', status: 'delivered', scheduledDate: '2026-01-13', agentId: 'da8', addressVerificationId: 'av11', clientName: 'Yasmine Chaker', clientPhone: '+213 555 012 345' },
  { id: 'd11', status: 'in_transit', scheduledDate: '2026-01-14', agentId: 'da1', addressVerificationId: 'av12', clientName: 'Djamel Ferhat', clientPhone: '+213 555 111 222' },
  { id: 'd12', status: 'in_transit', scheduledDate: '2026-01-15', agentId: 'da5', addressVerificationId: 'av13', clientName: 'Amina Larbi', clientPhone: '+213 555 333 444' },
  { id: 'd13', status: 'delivered', scheduledDate: '2026-01-16', agentId: 'da2', addressVerificationId: 'av14', clientName: 'Bilal Saidi', clientPhone: '+213 555 555 666' },
  { id: 'd14', status: 'failed', scheduledDate: '2026-01-17', agentId: 'da4', addressVerificationId: 'av15', clientName: 'Lamia Oussaid', clientPhone: '+213 555 777 888' },
];

// ─── Feedback ───────────────────────────────────────
export const feedbacks = [
  { id: 'f1', outcome: 'success', notes: 'Address was correct. Delivered without issues.', createdAt: '2026-01-06T14:00:00', deliveryId: 'd1' },
  { id: 'f2', outcome: 'success', notes: 'Building found easily. Client was home.', createdAt: '2026-01-06T16:30:00', deliveryId: 'd2' },
  { id: 'f3', outcome: 'address_not_found', notes: 'Could not locate the address. No street sign visible.', createdAt: '2026-01-07T12:00:00', deliveryId: 'd3' },
  { id: 'f4', outcome: 'success', notes: 'Perfect delivery. Boulevard well-known.', createdAt: '2026-01-07T18:00:00', deliveryId: 'd4' },
  { id: 'f5', outcome: 'wrong_address', notes: 'Client was at a different location.', createdAt: '2026-01-09T11:00:00', deliveryId: 'd6' },
  { id: 'f6', outcome: 'success', notes: 'Client picked up from ground floor.', createdAt: '2026-01-10T14:00:00', deliveryId: 'd7' },
  { id: 'f7', outcome: 'success', notes: 'Delivered to neighbor as instructed.', createdAt: '2026-01-12T10:00:00', deliveryId: 'd9' },
  { id: 'f8', outcome: 'success', notes: 'Cité universitaire gate was accessible.', createdAt: '2026-01-13T09:00:00', deliveryId: 'd10' },
  { id: 'f9', outcome: 'success', notes: 'Quick delivery in Bab El Oued area.', createdAt: '2026-01-16T13:00:00', deliveryId: 'd13' },
  { id: 'f10', outcome: 'address_not_found', notes: 'Invalid address. No such place exists.', createdAt: '2026-01-17T10:00:00', deliveryId: 'd14' },
];

// ─── API Logs ───────────────────────────────────────
export const apiLogs = [
  { id: 1, method: 'POST', endpoint: '/api/verify-address', requestTime: '2026-01-05T09:30:00', statusCode: 200 },
  { id: 2, method: 'POST', endpoint: '/api/verify-address', requestTime: '2026-01-05T10:15:00', statusCode: 200 },
  { id: 3, method: 'POST', endpoint: '/api/verify-address', requestTime: '2026-01-06T08:00:00', statusCode: 200 },
  { id: 4, method: 'GET', endpoint: '/api/admin/statistics', requestTime: '2026-01-06T09:00:00', statusCode: 200 },
  { id: 5, method: 'POST', endpoint: '/api/login', requestTime: '2026-01-06T09:00:05', statusCode: 200 },
  { id: 6, method: 'POST', endpoint: '/api/verify-address', requestTime: '2026-01-06T14:22:00', statusCode: 200 },
  { id: 7, method: 'GET', endpoint: '/api/deliveries', requestTime: '2026-01-07T08:10:00', statusCode: 200 },
  { id: 8, method: 'POST', endpoint: '/api/verify-address', requestTime: '2026-01-07T11:45:00', statusCode: 500 },
  { id: 9, method: 'POST', endpoint: '/api/login', requestTime: '2026-01-07T12:00:00', statusCode: 401 },
  { id: 10, method: 'POST', endpoint: '/api/verify-address', requestTime: '2026-01-08T16:00:00', statusCode: 200 },
  { id: 11, method: 'GET', endpoint: '/api/admin/agents', requestTime: '2026-01-09T07:30:00', statusCode: 200 },
  { id: 12, method: 'POST', endpoint: '/api/feedback', requestTime: '2026-01-09T11:00:00', statusCode: 200 },
  { id: 13, method: 'POST', endpoint: '/api/verify-address', requestTime: '2026-01-09T09:10:00', statusCode: 200 },
  { id: 14, method: 'GET', endpoint: '/api/admin/statistics', requestTime: '2026-01-10T08:00:00', statusCode: 200 },
  { id: 15, method: 'POST', endpoint: '/api/verify-address', requestTime: '2026-01-10T12:30:00', statusCode: 200 },
  { id: 16, method: 'POST', endpoint: '/api/verify-address', requestTime: '2026-01-11T07:55:00', statusCode: 422 },
  { id: 17, method: 'GET', endpoint: '/api/wilayas', requestTime: '2026-01-11T10:00:00', statusCode: 200 },
  { id: 18, method: 'GET', endpoint: '/api/communes', requestTime: '2026-01-11T10:00:05', statusCode: 200 },
  { id: 19, method: 'POST', endpoint: '/api/verify-address', requestTime: '2026-01-12T15:20:00', statusCode: 200 },
  { id: 20, method: 'POST', endpoint: '/api/login', requestTime: '2026-01-13T06:00:00', statusCode: 200 },
  { id: 21, method: 'POST', endpoint: '/api/verify-address', requestTime: '2026-01-13T10:00:00', statusCode: 200 },
  { id: 22, method: 'GET', endpoint: '/api/admin/statistics', requestTime: '2026-01-14T09:00:00', statusCode: 200 },
  { id: 23, method: 'POST', endpoint: '/api/verify-address', requestTime: '2026-01-14T13:40:00', statusCode: 200 },
  { id: 24, method: 'DELETE', endpoint: '/api/admin/agents/da99', requestTime: '2026-01-15T07:00:00', statusCode: 404 },
  { id: 25, method: 'POST', endpoint: '/api/verify-address', requestTime: '2026-01-15T08:25:00', statusCode: 200 },
  { id: 26, method: 'POST', endpoint: '/api/verify-address', requestTime: '2026-01-16T17:10:00', statusCode: 200 },
  { id: 27, method: 'GET', endpoint: '/api/admin/agents', requestTime: '2026-01-17T05:30:00', statusCode: 200 },
  { id: 28, method: 'POST', endpoint: '/api/verify-address', requestTime: '2026-01-17T06:30:00', statusCode: 200 },
  { id: 29, method: 'PUT', endpoint: '/api/admin/agents/da1', requestTime: '2026-01-17T08:00:00', statusCode: 200 },
  { id: 30, method: 'GET', endpoint: '/api/admin/statistics', requestTime: '2026-01-17T09:00:00', statusCode: 500 },
];

// ─── Dashboard Statistics ───────────────────────────
export const dashboardStats = {
  totalVerifications: 15847,
  avgConfidenceScore: 0.76,
  riskyAddresses: 1243,
  deliverySuccessRate: 0.892,
  totalDeliveries: 8924,
  totalAgents: 8,
  activeAgents: 6,
  totalApiCalls: 45892,
};

// ─── Monthly Trends ─────────────────────────────────
export const monthlyTrends = [
  { month: 'Jul', verifications: 1820, deliveries: 1200, successRate: 85 },
  { month: 'Aug', verifications: 2150, deliveries: 1400, successRate: 87 },
  { month: 'Sep', verifications: 1950, deliveries: 1350, successRate: 86 },
  { month: 'Oct', verifications: 2480, deliveries: 1620, successRate: 89 },
  { month: 'Nov', verifications: 2780, deliveries: 1800, successRate: 91 },
  { month: 'Dec', verifications: 2340, deliveries: 1550, successRate: 88 },
  { month: 'Jan', verifications: 2890, deliveries: 1900, successRate: 92 },
];

// ─── Verifications by Wilaya ────────────────────────
export const verificationsByWilaya = [
  { wilaya: 'Alger', count: 4250 },
  { wilaya: 'Oran', count: 2180 },
  { wilaya: 'Constantine', count: 1620 },
  { wilaya: 'Sétif', count: 1350 },
  { wilaya: 'Blida', count: 1100 },
  { wilaya: 'Batna', count: 980 },
  { wilaya: 'Tizi Ouzou', count: 870 },
  { wilaya: 'Béjaïa', count: 750 },
  { wilaya: 'Boumerdès', count: 690 },
  { wilaya: 'Tipaza', count: 580 },
];

// ─── Delivery Status Distribution ───────────────────
export const deliveryStatusDistribution = [
  { name: 'Delivered', value: 5620, color: '#10b981' },
  { name: 'In Transit', value: 1340, color: '#3b82f6' },
  { name: 'Pending', value: 1180, color: '#f59e0b' },
  { name: 'Failed', value: 784, color: '#ef4444' },
];

// ─── Score Distribution ─────────────────────────────
export const scoreDistribution = [
  { range: '0-10', count: 120 },
  { range: '11-20', count: 85 },
  { range: '21-30', count: 150 },
  { range: '31-40', count: 230 },
  { range: '41-50', count: 410 },
  { range: '51-60', count: 820 },
  { range: '61-70', count: 1650 },
  { range: '71-80', count: 3200 },
  { range: '81-90', count: 5100 },
  { range: '91-100', count: 4082 },
];

// ─── Error Rate Over Time ───────────────────────────
export const errorRateOverTime = [
  { date: '01/05', total: 180, errors: 5 },
  { date: '01/06', total: 220, errors: 3 },
  { date: '01/07', total: 195, errors: 8 },
  { date: '01/08', total: 240, errors: 4 },
  { date: '01/09', total: 210, errors: 6 },
  { date: '01/10', total: 260, errors: 2 },
  { date: '01/11', total: 185, errors: 9 },
  { date: '01/12', total: 275, errors: 3 },
  { date: '01/13', total: 230, errors: 5 },
  { date: '01/14', total: 290, errors: 7 },
  { date: '01/15', total: 255, errors: 4 },
  { date: '01/16', total: 310, errors: 6 },
  { date: '01/17', total: 270, errors: 8 },
];

// ─── Requests per Endpoint ──────────────────────────
export const requestsPerEndpoint = [
  { endpoint: '/api/verify-address', requests: 28540 },
  { endpoint: '/api/login', requests: 6230 },
  { endpoint: '/api/admin/statistics', requests: 4520 },
  { endpoint: '/api/deliveries', requests: 3180 },
  { endpoint: '/api/admin/agents', requests: 1860 },
  { endpoint: '/api/feedback', requests: 1120 },
  { endpoint: '/api/wilayas', requests: 320 },
  { endpoint: '/api/communes', requests: 122 },
];
