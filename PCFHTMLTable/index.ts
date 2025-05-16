import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class PCFHTMLTable implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _container: HTMLDivElement;
    private _selectedRecordId: string | null = null;
    private _notifyOutputChanged: () => void;

    constructor() {
        // Empty
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * 
     * @param context 
     *                  The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged 
     *                  A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state 
     *                  A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container 
     *                  If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this._container = container;
        this._notifyOutputChanged = notifyOutputChanged;
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Clear existing content
        this._container.innerHTML = "";
        
        // Early exit if dataset is undefined or loading
        if (!context.parameters.Items || context.parameters.Items.loading) {
            const loadingDiv = document.createElement("div");
            loadingDiv.innerText = "Loading...";
            this._container.appendChild(loadingDiv);
            return;
        }
        
        const table = document.createElement("table");
        table.style.width = "100%";
        
        // If the dataset is empty, show a message
        if (context.parameters.Items.sortedRecordIds.length === 0) {
            const emptyRow = table.insertRow();
            const emptyCell = emptyRow.insertCell();
            emptyCell.colSpan = context.parameters.Items.columns.length;
            emptyCell.innerText = "No data available";
            this._container.appendChild(table);
            return;
        }
        
        // Build table header
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        
        // Iterate through columns to create header cells
        for (const column of context.parameters.Items.columns) {
            const th = document.createElement("th");
            th.innerText = column.displayName;
            headerRow.appendChild(th);
        }

        // Build tbody
        const tbody = table.createTBody();
        for (const recordId of context.parameters.Items.sortedRecordIds) {
            const row = tbody.insertRow();
            const record = context.parameters.Items.records[recordId];

            for (const column of context.parameters.Items.columns) {
                const cell = row.insertCell();
                cell.innerText = record.getFormattedValue(column.name);
            }

            row.addEventListener("click", () => {
                // Remove previously selected styling
                const previouslySelected = tbody.querySelector('tr.selected');
                if (previouslySelected) previouslySelected.classList.remove('selected');
                
                // Add selected styling
                row.classList.add('selected');
                
                this._selectedRecordId = recordId;
                this._notifyOutputChanged();
            });
        }

        // Apply styles based on properties
        if (context.parameters.ShowGridLines && context.parameters.ShowGridLines.raw) {
            table.style.borderCollapse = "collapse";
            
            // Add border to cells and headers using GridLineThickness
            const thickness = context.parameters.GridLineThickness?.raw || 1;
            const styleTag = document.createElement('style');
            styleTag.textContent = `
                #${this._container.id} table td, 
                #${this._container.id} table th {
                    border: ${thickness}px solid #ddd;
                    padding: 8px;
                }
                #${this._container.id} table tr.selected {
                    background-color: #FFFFE0;
                }
            `;
            this._container.appendChild(styleTag);
        }
        
        // Finally, append the completed table
        this._container.appendChild(table);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        // This is empty but you're using _selectedRecordId
        return {
            SelectedRecordId: this._selectedRecordId || ""
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
