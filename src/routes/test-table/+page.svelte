<script>
    import { BaseTable, BaseTableElement } from "$lib/components/base-table/base-table.svelte";
    import TableRenderer from "$lib/components/base-table/table-renderer.svelte";
    import { onMount } from "svelte";

    /** 
     * @template T
     * @typedef {import '$lib/components/base-table/base-table.svelte'.TableElementHeader<T>} TableElementHeader<T>
     * */

    class PersonTableElement extends BaseTableElement {
        constructor(name, age, nationality) {
            super();
            this.name = $state(name);
            this.age = $state(age);
            this.nationality = $state(nationality);
        }

        sayHi = () => {
            alert(`hello there ${this.name}.`);
        }

        /** 
         * @returns {TableElementHeader<PersonTableElement>[]}
         */
        static getHeaders() {
            return [
                {
                    displayName: "الاسم",
                    render: (element) => {
                        return element.name;
                    }
                },
                {
                    displayName: "العمر",
                    render: (element) => element.age // optional, can omit if default
                },
                {
                    displayName: "الجنسية",
                    render: (element) => element.nationality
                },
            ];
        }
    }

    let table = $state(new BaseTable(PersonTableElement));

    onMount(() => {
        table.elements = [
            new PersonTableElement("محمد أحمد", 20, "مصري"),
            new PersonTableElement("سارة علي", 22, "سعودية"),
            new PersonTableElement("ليلى حسن", 19, "إماراتية"),
        ];
    });

    let person = $state({ name: 'hello world!' });
    let person2 = $state({ name: 'omar' });

    function render(obj) {
        return `<p>${obj.name}</p>`
    }    

    function handleClick() {
        person2.name = 'ahmed'
    }

</script>

<main>
    <div style="width: 800px;">
        <TableRenderer bind:source={table} />
         <!-- <button onclick={handleClick}>click me</button>
        {@html render(person2)} -->
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: 100vh;
    }

    button {
        padding: 10px;
    }
</style>