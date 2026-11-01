import { ExportAsMarkdown } from "./markdown.js";
import { ExportAsPDF } from "./pdf2.js";


Hooks.on('getCompendiumContextOptions', (_, menuitems) => {
    if (!game.user.isGM) return false;

    const condition = (li) => {
        const packName = li.dataset.pack;
        const pack = game.packs.get(packName);
        return 'JournalEntry' == pack?.documentName;
    };

    menuitems.push({
        name: 'exportJournals.exportMarkdown',
        icon: '<i class="fas fa-markdown"></i>',
        condition,
        callback: (li) => exportCompendium(li),
    });
})

async function exportCompendium(li) {
    const packName = li.dataset.pack;
    const pack = game.packs.get(packName);
    new Exporter(pack).render({ force: true });
}

class Exporter extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
    constructor(pack) {
        super();
        this.pack = pack;
        this.history = [];
    }

    static PARTS = {
        main: {
            template: 'modules/exportjournals/templates/exporter.hbs',
            root: true
        }
    }

    static DEFAULT_OPTIONS = {
        actions: {
            exportMarkdown: this.exportMarkdown,
            exportPDF: this.exportPDF,
        },
        position: {
            width: 500,
        },
        window: {
            contentClasses: ['standard-form'],
        }
    }

    get title() {
        return this.pack.metadata.label || this.pack.metadata.name || this.pack.metadata.id;
    }

    static exportMarkdown(ev, target) {
        const formData = new foundry.applications.ux.FormDataExtended(this.element.querySelector('form')).object;
        ExportAsMarkdown.exportPack(this.pack, formData);
        this.close();
    }

    updateProgress(progress) {
         this.progress.update({
                message: 'exportJournals.exportPDF',
                localize: true,
                pct: progress.val / progress.n
        });
    }

    receiveLogFromChild(log) {
        this.history.push(log);
        this.history = this.history.slice(-3);
        const prog = this.element.querySelector('.progress')
        prog.classList.remove('hidden');
        prog.textContent = this.history.join('\n');
    }

    static async exportPDF(ev, target) {
        window.receiveLogFromChild = this.receiveLogFromChild.bind(this);
        this.progress = ui.notifications.info('exportJournals.exportPDF', { progress: true, localize: true });
        const formData = new foundry.applications.ux.FormDataExtended(this.element.querySelector('form')).object;
        await ExportAsPDF.exportPack(this.pack, formData) //, this.updateProgress.bind(this));
        window.receiveLogFromChild = null;
        this.progress.update({
            message: 'exportJournals.exportPDF',
            localize: true,
            progress: 1
        });
        this.close();
    }
}