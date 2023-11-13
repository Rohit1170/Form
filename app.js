  const express = require('express');
  const mongoose = require('mongoose');
  const FormData = require('./models/FormData');

  const app = express();
  const port = 3000;
  app.set('view engine', 'ejs');
  // Connect to MongoDB
  mongoose.connect('mongodb+srv://rohit1170be20:table@table.ohc9o3j.mongodb.net/');

  const db = mongoose.connection;
  
  db.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });
  
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
  

  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));

  // Serve HTML form
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

  // Save form data to MongoDB
// Save form data to MongoDB
app.post('/save', async (req, res) => {
  const {
    serialNumber,
    fileNumber,
    portName,
    placeOfPort,
    caseNumber,
    fileOpeningDate,
    petitionerName,
    councilName,
    dateOfFiling,
    dateOfHearing,
    remarksStatus,
    category,
    dateOfDisposal,
  } = req.body;

  if (serialNumber && fileNumber /* Add other validations as needed */) {
    try {
      const formData = new FormData({
        serialNumber,
        fileNumber,
        portName,
        placeOfPort,
        caseNumber,
        fileOpeningDate,
        petitionerName,
        councilName,
        dateOfFiling,
        dateOfHearing,
        remarksStatus,
        category,
        dateOfDisposal,
      });
      console.log(req.body);

      await formData.save();

      // Redirect to the /backup endpoint after saving the data
      res.redirect('/backup');
    } catch (err) {
      console.error('Error saving data:', err.message);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(400).send('Please fill in all fields.');
  }
});

// Handle search form submission
app.post('/search', async (req, res) => {
  const searchSerialNumber = req.body.searchSerialNumber;

  try {
    const searchData = await FormData.find({ serialNumber: searchSerialNumber });

    if (searchData.length > 0) {
      // Render the search results in a table or any desired format
      const tableHtml = `
      <style>
            h2 {
              text-align: center;
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              padding: 12px;
              text-align: left;
              border: 1px solid #ddd;
            }
            th {
              background-color: #f2f2f2;
            }
            button {
              padding: 8px;
              background-color: #4CAF50;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
            button:hover {
              background-color: #45a049;
            }
          </style>
        <h2>Search Results</h2>
        <table>
          <tr>
            <th>Serial Number</th>
            <th>File Number</th>
            <th>Port Name</th>
            <th>Place of Port</th>
            <th>Case Number</th>
            <th>File Opening Date</th>
            <th>Petitioner Name</th>
            <th>Council Name</th>
            <th>Date of Filing</th>
            <th>Date of Hearing</th>
            <th>Remarks Status</th>
            <th>Category</th>
            <th>Date of Disposal</th>
            <th>Action</th>
          </tr>
          ${searchData.map(row => `
            <tr>
              <td>${row.serialNumber}</td>
              <td>${row.fileNumber}</td>
              <td>${row.portName}</td>
              <td>${row.placeOfPort}</td>
              <td>${row.caseNumber}</td>
              <td>${row.fileOpeningDate}</td>
              <td>${row.petitionerName}</td>
              <td>${row.councilName}</td>
              <td>${row.dateOfFiling}</td>
              <td>${row.dateOfHearing}</td>
              <td>${row.remarksStatus}</td>
              <td>${row.category}</td>
              <td>${row.dateOfDisposal}</td>
              <td>
              <button onclick="editRow('${row._id}')">Edit</button>
              <button onclick="deleteRow('${row._id}')">Delete</button>
              </td>
            </tr>
          `).join('')}
        </table>
        <script>
        function editRow(id) {
          // Redirect to an edit page with the selected row ID
          window.location.href = '/edit/' + id;
        }
        function deleteRow(id) {
          if (confirm('Are you sure you want to delete this data?')) {
            // If the user confirms, redirect to the delete endpoint
            window.location.href = '/delete/' + id;
          }
        }
      </script>
      `;

      res.send(tableHtml);
    } 
      else {
        res.send(`
        <p>No matching records found.</p>
        <button onclick="redirectToIndex()">Go to Home</button>
        <script>
          function redirectToIndex() {
            window.location.href = '/';
          }
        </script>
      `);
      
    }
  } catch (err) {
    console.error('Error searching data:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Index route
app.get('/', async (req, res) => {
  const searchSerialNumber = req.query.searchSerialNumber;

  if (searchSerialNumber) {
    try {
      const searchData = await FormData.find({ serialNumber: searchSerialNumber });

      if (searchData.length > 0) {
        // Render the search results in a table with the desired styling
        const tableHtml = `
          
      
          <h2>Search Results</h2>
          <table>
            <tr>
              <th>Serial Number</th>
              <th>File Number</th>
              <th>Port Name</th>
              <th>Place of Port</th>
              <th>Case Number</th>
              <th>File Opening Date</th>
              <th>Petitioner Name</th>
              <th>Council Name</th>
              <th>Date of Filing</th>
              <th>Date of Hearing</th>
              <th>Remarks Status</th>
              <th>Category</th>
              <th>Date of Disposal</th>
              <th>Action</th>
            </tr>
            ${searchData.map(row => `
              <tr>
                <td>${row.serialNumber}</td>
                <td>${row.fileNumber}</td>
                <td>${row.portName}</td>
                <td>${row.placeOfPort}</td>
                <td>${row.caseNumber}</td>
                <td>${row.fileOpeningDate}</td>
                <td>${row.petitionerName}</td>
                <td>${row.councilName}</td>
                <td>${row.dateOfFiling}</td>
                <td>${row.dateOfHearing}</td>
                <td>${row.remarksStatus}</td>
                <td>${row.category}</td>
                <td>${row.dateOfDisposal}</td>
                <td>
                <button onclick="editRow('${row._id}')">Edit</button>
                <button onclick="deleteRow('${row._id}')">Delete</button>
                </td>
              </tr>
            `).join('')}
          </table>
          <script>
          function editRow(id) {
            // Redirect to an edit page with the selected row ID
            window.location.href = '/edit/' + id;
          }
          function deleteRow(id) {
            if (confirm('Are you sure you want to delete this data?')) {
              // If the user confirms, redirect to the delete endpoint
              window.location.href = '/delete/' + id;
            }
          }
        </script>
        `;
        
        res.send(tableHtml);
      } else {
        res.send('No matching records found.');
      }
      
    } catch (err) {
      console.error('Error searching data:', err.message);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.sendFile(__dirname + '/public/index.html');
  }
});

app.get('/backup', async (req, res) => {
  try {
    const data = await FormData.find();

    if (data.length > 0) {
      // Generate HTML table with improved styling
      const tableHtml = `
        <style>
          h2 {
            text-align: center;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
          }
          th {
            background-color: #f2f2f2;
          }
          button {
            padding: 8px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          button:hover {
            background-color: #45a049;
          }
        </style>
        <h2>Backup Data</h2>
        <table>
          <tr>
            <th>Serial Number</th>
            <th>File Number</th>
            <th>Port Name</th>
            <th>Place of Port</th>
            <th>Case Number</th>
            <th>File Opening Date</th>
            <th>Petitioner Name</th>
            <th>Council Name</th>
            <th>Date of Filing</th>
            <th>Date of Hearing</th>
            <th>Remarks Status</th>
            <th>Category</th>
            <th>Date of Disposal</th>
            <th>Action</th>
          </tr>
          ${data.map(row => `
            <tr>
              <td>${row.serialNumber}</td>
              <td>${row.fileNumber}</td>
              <td>${row.portName}</td>
              <td>${row.placeOfPort}</td>
              <td>${row.caseNumber}</td>
              <td>${row.fileOpeningDate}</td>
              <td>${row.petitionerName}</td>
              <td>${row.councilName}</td>
              <td>${row.dateOfFiling}</td>
              <td>${row.dateOfHearing}</td>
              <td>${row.remarksStatus}</td>
              <td>${row.category}</td>
              <td>${row.dateOfDisposal}</td>
              <td>
                <button onclick="editRow('${row._id}')">Edit</button>
                <button onclick="deleteRow('${row._id}')">Delete</button>
              </td>
            </tr>
          `).join('')}
        </table>
    
        <script>
          function editRow(id) {
            // Redirect to an edit page with the selected row ID
            window.location.href = '/edit/' + id;
          }
          function deleteRow(id) {
            if (confirm('Are you sure you want to delete this data?')) {
              // If the user confirms, redirect to the delete endpoint
              window.location.href = '/delete/' + id;
            }
          }
        </script>
      `;
      res.send(tableHtml);
    } else {
    res.send(`
    <p>No backup data available.</p>
    <button onclick="redirectToIndex()">Go to Home</button>
    <script>
      function redirectToIndex() {
        window.location.href = '/';
      }
    </script>
  `);
     }
    }
      catch (err) {
    console.error('Error fetching backup data:', err.message);
    res.status(500).send('Internal Server Error');
  }

});

    
    // Edit form route
    app.get('/edit/:id', async (req, res) => {
      const id = req.params.id;
    
      try {
        const formData = await FormData.findById(id);
    
        if (formData) {
          // Render the edit.html file with the data
          res.render('update', { formData });
        } else {
          res.status(404).send('Data not found.');
        }
      } catch (err) {
        console.error('Error fetching data for editing:', err.message);
        res.status(500).send('Internal Server Error');
      }
    });
    // Update data route
// Update data route
app.post('/update/:id', async (req, res) => {
  const id = req.params.id;

  // Handle updating the data in the database
  try {
    const updatedData = {
      serialNumber: req.body.serialNumber,
      fileNumber: req.body.fileNumber,
      portName: req.body.portName,
      placeOfPort: req.body.placeOfPort,
      caseNumber: req.body.caseNumber,
      fileOpeningDate: req.body.fileOpeningDate,
      petitionerName: req.body.petitionerName,
      councilName: req.body.councilName,
      dateOfFiling: req.body.dateOfFiling,
      dateOfHearing: req.body.dateOfHearing,
      remarksStatus: req.body.remarksStatus,
      category: req.body.category,
      dateOfDisposal: req.body.dateOfDisposal,
    };

    // Use { new: true } to return the modified document instead of the original
    const formData = await FormData.findByIdAndUpdate(id, updatedData, { new: true });

    if (formData) {
      res.send('<h2>Data updated successfully!</h2><br><button><a href="/backup">Go back to Backup</a></button>');
    } else {
      res.status(404).send('<h2>Data not found.</h2><br><a href="/backup">Go back to Backup</a>');
    }
  } catch (err) {
    console.error('Error updating data:', err.message);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/delete/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const formData = await FormData.findById(id);

    if (formData) {
      await FormData.deleteOne({ _id: id });
      // Render the delete.html file after successful deletion
      res.sendFile(__dirname + '/public/delete.html');
    } else {
      res.status(404).send('Data not found.');
    }
  } catch (err) {
    console.error('Error deleting data:', err.message);
    res.status(500).send('Internal Server Error');
  }
});


    
    
    // ... (remaining code)
    
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
    