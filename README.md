# PCF-Dataset-HTML-Table


## Step 01: Create and Scaffold the Project

```PowerShell
pac pcf init --namespace YOUR_NAMESPACE_HERE --name YOUR_PCF_COMPONENT_NAME --template dataset --framework None

# Darrens Example
# pac pcf init --namespace SuperPowerLabs --name PCFHTMLTable --template dataset --framework None

# Install Needed NPM
npm install
```

## Step 02: Recognize Key Files/Folders

Take a look around at what's been created!

## Step 03: Add the **Items** Dataset Property

- In `ControlManifest.Input.xml`, replace the default `<data-set…>` node with:  
  
```xml
<data-set name="Items" display-name-key="Items" />
```  

This registers a binding identical in spirit to the Gallery’s **Items** property, allowing makers to point the control at any table or collection.

Dataset properties bring paging, sorting, selected record tracking, and automatic schema discovery—capabilities the Gallery relies on behind the scenes. Using the same pattern keeps learning curves low for non-coders migrating to PCF.

```PowerShell

```
## Step 04: Other Properties are Needed 

Properties that would be appropriate for a control like this!

- ShowGridLines 
- GridLineThickness

```xml
<property name="ShowGridLines"
        of-type="TwoOptions.YesNo"
        usage="input"
        default-value="true" />

<property name="GridLineThickness"
        of-type="Whole.None"
        usage="input"
        default-value="1" />
```  

- TwoOptions renders a true/false toggle in Studio
- Whole.None provides an integer slider

>Consider: Non-developers will see friendly check-boxes and number pickers in the right-hand pane of Power Apps Studio, mirroring component custom properties they already use inside Canvas components

## Step 05: Render the HTML Table

- Build the skeleton in `updateView`
    - Replace the generated body with code that 
      - Creates a `<table>` 
      - Iterates `context.parameters.Items.sortedRecordIds`, 
      - Builds a `<thead>` from dataset columns 
      - A `<tbody>` from row values using `getFormattedValue()`. 
    - This mirrors the implicit templating engine of Gallery but in raw DOM calls. 

- Respect property inputs
    - Conditionally apply a `table { border-collapse:collapse; }` style block only when `context.parameters.ShowGridLines.raw` is true. 

- Example usage in Canvas
    - After importing, set ShowGridLines to `false` when embedding the table in a minimalist dashboard where cell borders feel noisy, or set GridLineThickness to `3` to create bold separators for a read-only finance matrix without formula tinkering.

## Step 06: Wire Outputs for Interactivity

- Provide a SelectedRecordId output
    - Add an output property so makers can capture row clicks:  

```xml
<property name="SelectedRecordId"
        of-type="SingleLine.Text"
        usage="output" />
```  

Call `notifyOutputChanged()` when a user clicks a row and store `recordId` locally. Makers can then write `Set(varOrderId, HtmlTableLab.SelectedRecordId)` exactly like they would with a Gallery’s `Selected` record. 

## Step 07: Build & Test Locally

- Compile and run the `TEST HARNESS`
    - Execute `npm run build` then `npm start`. 
    - The harness uses sample data to preview the grid, letting you toggle the custom properties live without publishing. This rapid loop echoes Play mode inside Canvas apps.

```PowerShell
npm run build
npm start
```

  - Debug tips
      - Use `console.log` statements to inspect property values and browser DevTools to tweak CSS on the fly, speeding up pixel-perfect adjustments before deployment. 


## Step 08: Deploy to Your Environment

- Push directly from the CLI
    - From the project root run `pac pcf push` to package, upload, and register the control in your default solution. This skips building a managed solution for classroom speed. 

- Import into a Canvas app
    - Open Power Apps Studio 
    - ➜ **Insert → Get more components → Code** and add **HtmlTableLab**. 
    - Drop it onto the screen, set **Items** to `Gallery1.AllItems` or any collection (`ClearCollect(colPeople, People)`), and experiment with the new properties.

```PowerShell

```
