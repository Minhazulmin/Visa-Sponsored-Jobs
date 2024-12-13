// Fetch job data and populate the table
document.addEventListener('DOMContentLoaded', function() {
    const jobListContainer = document.getElementById('job-list');
    const lastUpdated = document.getElementById('last-updated');
    
    // Function to fetch the job data from the GitHub repository
    const fetchJobData = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/Minhazulmin/Visa-Sponsored-Jobs/main/jobList.json');
            const jobData = await response.json();

            // Clear existing job rows
            jobListContainer.querySelector('tbody').innerHTML = '';

            // Loop through job data and create table rows
            jobData.forEach(job => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${job.company}</td>
                    <td>${job.position}</td>
                    <td>${job.location.split(' ').slice(0, -1).join(' ')}</td>
                    <td>${job.post_date}</td>
                    <td>${job.location.split(' ').pop()}</td>
                    <td><a href="${job.description}" target="_blank">Apply</a></td>
                `;
                jobListContainer.querySelector('tbody').appendChild(row);
            });

            // Update the "Last updated" timestamp
            lastUpdated.textContent = new Date().toUTCString();

        } catch (error) {
            console.error('Error fetching job data:', error);
        }
    };

    // Fetch job data when the page loads
    fetchJobData();

    // Optionally, set an interval to refresh data every 5 minutes (300000 ms)
    setInterval(fetchJobData, 300000); // Refresh data every 5 minutes
});
