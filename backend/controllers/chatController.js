const asyncHandler = require('express-async-handler');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Recouvrement = require('../models/Recouvrement');
const Contrat = require('../models/Contrat');
const Assurance = require('../models/Assurance');
const Action = require('../models/Action');

let genAI = null;
if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// @desc    Chat with AI Assistant (RAG)
// @route   POST /api/chat
// @access  Private (Admin + Juriste)
const handleChat = asyncHandler(async (req, res) => {
    const { message, history } = req.body;
    
    if (!message) {
        res.status(400);
        throw new Error('Message is required');
    }

    const userRole = req.user?.role || 'Juriste';

    try {
        // Smart RAG: fetch data relevant to the query
        const lowerMsg = message.toLowerCase();
        
        let recouvrements = [], contrats = [], assurances = [], actions = [];

        // Intelligent filtering based on question
        if (lowerMsg.includes('contrat') || lowerMsg.includes('renouvellement') || lowerMsg.includes('expir')) {
            contrats = await Contrat.find().lean();
        } else if (lowerMsg.includes('assurance') || lowerMsg.includes('sinistre') || lowerMsg.includes('indemnisation') || lowerMsg.includes('police')) {
            assurances = await Assurance.find().lean();
        } else if (lowerMsg.includes('contentieux') || lowerMsg.includes('dossier') || lowerMsg.includes('recouvrement') || lowerMsg.includes('audience') || lowerMsg.includes('tribunal')) {
            recouvrements = await Recouvrement.find().lean();
        } else if (lowerMsg.includes('action') || lowerMsg.includes('urgent') || lowerMsg.includes('tâche') || lowerMsg.includes('priorit')) {
            actions = await Action.find().lean();
        } else {
            // General query: fetch everything
            recouvrements = await Recouvrement.find().lean();
            contrats = await Contrat.find().lean();
            assurances = await Assurance.find().lean();
            actions = await Action.find().lean();
        }

        const contextData = JSON.stringify({
            recouvrements: recouvrements.length > 0 ? recouvrements : 'Aucune donnée',
            contrats: contrats.length > 0 ? contrats : 'Aucune donnée',
            assurances: assurances.length > 0 ? assurances : 'Aucune donnée',
            actions: actions.length > 0 ? actions : 'Aucune donnée'
        });

        let roleContext = '';
        if (userRole === 'Admin') {
            roleContext = `L'utilisateur est un **Administrateur**. Il a accès à toutes les statistiques, KPI, et données stratégiques. Fournis des analyses détaillées, des recommandations de gestion et des indicateurs clés.`;
        } else if (userRole === 'Directeur Général') {
            roleContext = `L'utilisateur est le **Directeur Général**. Il a besoin d'une vision globale, de résumés exécutifs, et de la situation des risques et des KPIs stratégiques de la SRM.`;
        } else {
            roleContext = `L'utilisateur est un **Juriste** ou opérationnel. Il a besoin d'aide sur les procédures juridiques, les dossiers contentieux et les clauses contractuelles. Oriente-le vers les bonnes procédures et aide-le à comprendre l'état de ses dossiers.`;
        }

        const historyContext = history && history.length > 0 
            ? `\nHistorique de la conversation:\n${history.slice(-5).map(m => `${m.sender === 'user' ? 'Utilisateur' : 'Assistant'}: ${m.text}`).join('\n')}\n`
            : '';

        const prompt = `
Tu es **SIGAJA Assistant**, un assistant IA intégré au Système Informatisé de Gestion des Affaires Juridiques et des Assurances (Société Régionale Multiservices - Laâyoune Sakia El Hamra).

${roleContext}

${historyContext}

Voici les données actuelles extraites de la base de données en JSON:
${contextData}

Règles:
- Réponds TOUJOURS en français
- Ne fabrique JAMAIS de données qui ne sont pas dans le JSON
- Si les données sont vides, dis clairement qu'il n'y a pas de données enregistrées
- Utilise des listes à puces et du gras Markdown pour structurer tes réponses
- Si l'utilisateur te salue, présente-toi comme l'assistant SIGAJA et indique que tu as accès aux données du système

Question de l'utilisateur: "${message}"
`;

        if (genAI) {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            res.status(200).json({ reply: responseText });
        } else {
            // Smart mock response using real data
            let mockReply = "👋 Bonjour ! Je suis l'assistant **SIGAJA**.\n\n";
            
            if (recouvrements.length > 0) {
                const enCours = recouvrements.filter(r => r.statut === 'En cours' || r.statut === 'En justice').length;
                mockReply += `📁 **Contentieux**: ${recouvrements.length} dossier(s) dont ${enCours} en cours\n`;
            }
            if (contrats.length > 0) {
                const actifs = contrats.filter(c => c.statut === 'Actif').length;
                mockReply += `📋 **Contrats**: ${contrats.length} contrat(s) dont ${actifs} actif(s)\n`;
            }
            if (assurances.length > 0) {
                const declares = assurances.filter(a => a.statut === 'Déclaré').length;
                mockReply += `🛡️ **Assurances**: ${assurances.length} déclaration(s) dont ${declares} en attente\n`;
            }
            if (actions.length > 0) {
                const urgentes = actions.filter(a => a.statut === 'Urgent').length;
                mockReply += `⚡ **Actions**: ${actions.length} action(s) dont ${urgentes} urgente(s)\n`;
            }

            mockReply += "\n> 💡 *Pour des réponses IA complètes, ajoutez `GEMINI_API_KEY` au fichier `.env` du backend.*";

            res.status(200).json({ reply: mockReply });
        }
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ reply: 'Désolé, une erreur est survenue lors du traitement de votre demande.' });
    }
});

module.exports = { handleChat };
