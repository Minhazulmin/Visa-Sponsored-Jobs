document.addEventListener('DOMContentLoaded', function() {
    const jobCardsContainer = document.getElementById('job-cards-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const lastUpdated = document.getElementById('last-updated');

    let jobData = [];
    let displayedJobs = 0;
    const JOBS_PER_PAGE = 20;

    // Function to fetch job data
    const fetchJobData = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/Minhazulmin/Visa-Sponsored-Jobs/main/jobList.json');
            jobData = await response.json();
            lastUpdated.textContent = new Date().toUTCString();
            displayJobs();
        } catch (error) {
            console.error('Error fetching job data:', error);
            lastUpdated.textContent = 'Failed to load data.';
        }
    };

    // Function to display jobs
    const displayJobs = () => {
        const jobsToDisplay = jobData.slice(displayedJobs, displayedJobs + JOBS_PER_PAGE);
        
        jobsToDisplay.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.classList.add('job-card');
            jobCard.innerHTML = `
                <h3>${job.company}</h3>
                <p>${job.position}</p>
                <p class="location">${job.location.split(' ').slice(0, -1).join(' ')}</p>
                <a href="${job.description}" class="apply-btn" target="_blank">Apply Now</a>
            `;
            jobCardsContainer.appendChild(jobCard);
        });

        displayedJobs += JOBS_PER_PAGE;

        // Disable the "Load More" button if no more jobs are available
        if (displayedJobs >= jobData.length) {
            loadMoreBtn.disabled = true;
            loadMoreBtn.textContent = 'No More Jobs';
        }
    };

    // Event Listener for "Load More" button
    loadMoreBtn.addEventListener('click', displayJobs);

    // Fetch job data when the page loads
    fetchJobData();
});
