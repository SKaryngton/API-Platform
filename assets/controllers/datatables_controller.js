import {Controller} from '@hotwired/stimulus';
import 'datatables.net-bs5/css/dataTables.bootstrap5.css';
import 'datatables.net-bs5';
import 'datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.colVis.min.js';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';
import jszip from 'jszip';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import Swal from "sweetalert2";

window.JSZip = jszip;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default class extends Controller {

    connect() {

        if (!$.fn.DataTable.isDataTable(this.element)) {
            this.table = $(this.element).DataTable({

                dom: 'Blfrtip',// Define the structure of the table (buttons, length control, filtering input, etc.).

                buttons: [ // Define the buttons that should be included
                    // Define a copy button with a customized title
                    {
                        extend: 'copy',
                        title: function() {
                            return getExportFileName();
                        }
                    },
                    // Define a CSV export button with a customized title
                    {
                        extend: 'csv',
                        action: function (e, dt, node, config) {
                            // Using jQuery to show the modal and backdrop
                            $('#modalBackdrop').show();
                            $('#exportModal').show();

                            $('#exportFileName').val(getExportFileName());

                            // Binding the click event with jQuery
                            $('#confirmExport').off('click').on('click', () => {
                                // Hide the modal and backdrop using jQuery
                                $('#modalBackdrop').hide();
                                $('#exportModal').hide();

                                // Set the new filename from the input value
                                config.filename = $('#exportFileName').val();

                                // Execute the default export action with the updated configuration
                                $.fn.dataTable.ext.buttons.csvHtml5.action.call(this, e, dt, node, config);
                            });

                            // Binding the click event with jQuery
                            $('#cancelExport').off('click').on('click', () => {
                                // Hide the modal and backdrop using jQuery
                                $('#modalBackdrop').hide();
                                $('#exportModal').hide();
                            });

                        }
                    },
                    // Define an Excel export button with a customized title
                    {
                        extend: 'excel',
                        title:  function() {
                            return getExportFileName();
                        }
                    },
                    // Define a PDF export button with a customized title
                    {
                        extend: 'pdf',
                        title: function() {
                            return getExportFileName();
                        }
                    },
                    // Define a print button with a customized title
                    {
                        extend: 'print',
                        title: function() {
                            return getExportFileName();
                        }
                    }
                ],
                language: { //customize
                    lengthMenu: "Show _MENU_",
                    info: "_END_ of _TOTAL_", //info: "_START_ to _END_ of _TOTAL_"
                },
                initComplete: function () { // Function to run when table initialization is complete
                    const table = this;
                    const wrapper = $(this).closest('.dataTables_wrapper'); // Get the wrapper div of the DataTable.
                    const lengthControl = wrapper.find('.dataTables_length'); // Get the length control element.
                    const filterControl = wrapper.find('.dataTables_filter').addClass('d-flex justify-content-center gap-0'); // Get the filter control element.
                    const buttons = wrapper.find('.dt-buttons'); // Get the buttons container element.
                    const pageInfo = wrapper.find('.dataTables_info'); // Get the page info element.
                    const paginationControl = wrapper.find('.dataTables_paginate'); // Get the pagination control element.

                    const searchInput = filterControl.find('input[type="search"]'); // Get the search input element.
                    searchInput.css('width','99%').css('height','100%').attr('placeholder', 'Search'); // Set the placeholder text for the search input.
                    const searchInputLabel=filterControl.find('label');
                    searchInputLabel.css('flex','1 0 80%');
                    searchInputLabel.contents().filter(function () {
                        return this.nodeType === 3; // Node.TEXT_NODE
                    }).remove(); // Remove the label text of the filter control.

                    // Add a column selector next to the search input.
                    const columnSelect = $('<select>')
                        .css('flex','1 0 20%')// Set flex to use 30% of the filterControl.
                        .on('change', function () { // Event handler for column selector change.
                            const columnIndex = $(this).val(); // Get the selected column index.
                            searchInput.data('columnIndex', columnIndex); // Store the column index in the search input data.
                            searchInput.trigger('input'); // Trigger the input event of the search input.
                        });

                    // Add an "All" option for searching in all columns.
                    $('<option>')
                        .val('')
                        .text('All')
                        .appendTo(columnSelect);

                    // Add an option for each column.
                    table.api().columns().every(function () {
                        const column = this;
                        const title = $(column.header()).text(); // Get the column title.
                        $('<option>')
                            .val(column.index()) // Set the column index as the option value.
                            .text(title) // Set the column title as the option text.
                            .appendTo(columnSelect);
                    });

                    filterControl.prepend(columnSelect); // Add the column selector to the filter control.




                    // Modify the search behavior to use the column selector.
                    searchInput.on('input', function () {
                        const columnIndex = $(this).data('columnIndex'); // Get the selected column index.
                        if (columnIndex === undefined || columnIndex === '') {
                            table.api().search(this.value).draw(); // Search in all columns.
                        } else {
                            table.api().column(columnIndex).search(this.value).draw(); // Search in the selected column.
                        }
                    });

                    // Create a top div and add the length control, filter control, and buttons.
                    const topDiv = $('<div/>')
                        .addClass('d-flex justify-content-between mb-3 gap-1')
                        .append(lengthControl.css('flex', '1 0 5%')) // Set flex to use 10% of the topDiv.
                        .append(filterControl.css('flex', '1 0 60%')) // Set flex to use 50% of the topDiv.
                        .append(buttons.css('flex', '1 0 25%')); // Set flex to use 40% of the topDiv.

                    // Create a bottom div and add the page info and pagination control.
                    const bottomDiv = $('<div/>')
                        .addClass('d-flex justify-content-between mb-3')
                        .append(pageInfo)
                        .append(paginationControl);

                    wrapper.prepend(topDiv); // Add the top div to the wrapper.
                    wrapper.append(bottomDiv); // Add the bottom div to the wrapper.

                }
            });
        }

        // Function to generate the export file name based on the values of userSelectForm fields
        function getExportFileName() {
            const username = $('#userSelectForm_user option:selected').text();  // Get the text of the selected option in the username field from userSelectForm
            const startDate = $('#userSelectForm_startDate').val();  // Get the value of the startDate field from userSelectForm
            const endDate = $('#userSelectForm_endDate').val();  // Get the value of the endDate field from userSelectForm
            const query = $('#searchForm_query').val();  // Get the value of the query field from searchForm

            let title = 'Export';  // Initialize the title with "Export"
            if (username) {
                title += `_${username}`;  // If username is not empty, add it to the title
            }
            if (startDate) {
                title += `_${startDate}`;  // If startDate is not empty, add it to the title
            }
            if (endDate) {
                title += `_${endDate}`;  // If endDate is not empty, add it to the title
            }
            if (query) {
                title += `_${query}`;  // If query is not empty, add it to the title
            }
            return title;  // Return the title
        }




    }


}
