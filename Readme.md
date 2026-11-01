![Version](https://img.shields.io/github/v/tag/Cibola8/exportjournals?label=Version&style=flat-square&color=2577a1) ![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2FCibola8%2Fexportjournals%2Ffoundry14%2Fmodule.json&label=Foundry%20Core%20Compatible%20Version&query=$.compatibility.verified&style=flat-square&color=ff6400)


# Export Journals

Have you ever wanted to read your Foundry texts without having to stay in Foundry all the time? Do you find reading long texts in journals tiring and would rather sit on the couch with a tablet to read your notes or lore information?

Then Export Journals is exactly what you need. Export Journals is a module to export journals as Markdown files or as a PDF.

Note that this is just for convenient reading. The PDF is not pretty.

## Usage

After installation, you'll find the "Export as Markdown" command in the context menu of journal compendiums.

![grafik](https://github.com/user-attachments/assets/8fb2f296-194d-4133-a3aa-57300c67f836)

Once clicked, a window opens with the following options:
- **Enrich**: When this option is active, Foundry Journal enrichers (e.g., `[[/Roll 1d10]]`) will be converted. If inactive, the enrichers will be copied to the export as they are.
- **Link convert**: 
    * Convert: Will try to convert the links so they work outside of foundry (currently markdown only)
    * Remove links: When active, links to documents (actors, journals, etc.) will be removed and only the text will be transferred. 
    * Inactive: If inactive, the links will remain as they are in Foundry.
- **Text field**: This shows information about the current export status for PDF exports.

![grafik](https://github.com/user-attachments/assets/ae01344f-8043-433b-8ff0-584c69fa399b)

### Markdown Export
The Markdown export creates a folder for each journal, with journal pages saved as individual Markdown files.

The Markdown files can then be opened and read by any program (e.g., Obsidian).

### PDF Export
The PDF export creates a PDF file containing all journals with their pages in sequence (currently slow and experimental).

## Permissions
The command can only be used with the GM role!
