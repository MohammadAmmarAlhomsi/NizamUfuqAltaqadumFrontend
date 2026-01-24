import { getUserData as getUserDataAsync } from '$lib/sdk/auth';
import { StudentsTableElement } from '$lib/components/tables-elements/students-table-element.svelte';
import { Student } from '$lib/sdk/models/student.svelte';
import { StudentsSection } from '$lib/sections/students-section.svelte';
import { InstructorsSection } from '$lib/sections/instructors-section.svelte';
import { TableSection } from '$lib/sections/table-section.svelte';
import { HalqatSection } from '$lib/sections/halqat-section.svelte';
import { ExaminersSection } from '$lib/sections/examiners-section.svelte';

export class DirectorPage {
    constructor() {
        /** @type {{label: string}[]} */
        this.tabs = $state([ 
            { label: 'الطلاب' }, 
            { label: 'الأساتذة' },
            { label: 'الحلقات' },
            { label: 'المختبرين' },
        ])
        
        /** @type {TableSection[]} */
        this.sections = $state([
            new StudentsSection(),
            new InstructorsSection(),
            new HalqatSection(),
            new ExaminersSection()
        ]);

        /** @type {TableSection} */
        this.currentSection = $state(null);

        $effect(() => {
            this.currentSection = this.sections[this.selectedTabIdx]
            this.currentSection.loadElements();
        })

        /** @type {int} */
        this.selectedTabIdx = $state(0);
    }

    onMount = async () => {
        let userData = await getUserDataAsync();
        console.log(userData);
        if (userData == null) {
            window.location.href = `/signin`
        }
    }

    handleCreateNew = async () => {
        await this.currentSection.createNew();
    }
}