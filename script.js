document.addEventListener('DOMContentLoaded', function () {
    const jobCardsContainer = document.getElementById('job-cards-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const lastUpdated = document.getElementById('last-updated');
    const searchInput = document.getElementById('searchInput');

    let jobData = []; // Holds the original data
    let filteredJobData = []; // Holds the filtered data
    let displayedJobs = 0;
    const JOBS_PER_PAGE = 10;

    // Fetch job data
    const fetchJobData = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/Minhazulmin/Visa-Sponsored-Jobs/main/jobList.json');
            jobData = await response.json(); // Store original data
            filteredJobData = [...jobData]; // Start with the original data in filteredJobData
            lastUpdated.textContent = 'Last Updated: ' + new Date().toUTCString();
            displayJobs();
        } catch (error) {
            lastUpdated.textContent = 'Failed to load data.';
        }
    };

    // Function to display jobs
    const displayJobs = () => {
        const jobsToDisplay = filteredJobData.slice(displayedJobs, displayedJobs + JOBS_PER_PAGE);

        if(jobsToDisplay.length > 0 ){
            jobsToDisplay.forEach(job => {
                const jobCard = document.createElement('div');
                jobCard.classList.add('job-card');
                let image = isValidUrl(job.logo);
                jobCard.innerHTML = `
                <div class="image-wid">
                
                    <img src="${image}" alt="${job.position}" class="" loading="lazy">
                </div>
                <div>
                    <a class="title-a" href="${job.description}"target="_blank"><h3>${job.position}</h3></a>
                    <p class="location">${job.company}</p>
                    <p >${job.location.split(' ').slice(0, -1).join(' ')}</p>
                    <div class="mt-2"><span class="visa">${job.visa} || </span> <span class="reloc">${job.reloc} || </span> <span class="contract">${job.contract}</span></div>
                    <span class="day-ago"> ${timeAgo(job.post_date)}</span><a href="${job.description}" class="apply-btn" target="_blank">Apply Now</a> 
                </div>
                     `;
                jobCardsContainer.appendChild(jobCard);
            });

        } else {
            const jobCard = document.createElement('div');
            jobCard.classList.add('job-card');
            jobCard.innerHTML = `<h4>No Search Results...</h3>`;
            jobCardsContainer.appendChild(jobCard);  
        }
        displayedJobs += JOBS_PER_PAGE;
        // Disable the "Load More" button if no more jobs are available
        if(filteredJobData.length == 0 ){
            loadMoreBtn.classList.add('display-none');
        }

       
    };

    // Event listener for "Load More" button
    loadMoreBtn.addEventListener('click', () => {
        displayJobs();
    });

    // Filter jobs based on search input
    searchInput.addEventListener('keyup', () => {
        const query = searchInput.value.trim().toLowerCase();

        if (query === '') {
            // If the search input is cleared, reset to the original job data
            filteredJobData = [...jobData];
            loadMoreBtn.classList.remove('display-none');
        } else {
            // Filter the jobs based on the search query
            filteredJobData = jobData.filter(job => 
                job.company.toLowerCase().includes(query) ||
                job.position.toLowerCase().includes(query) ||
                job.location.toLowerCase().includes(query)
            );
        }

        // Reset variables and display the filtered jobs
        jobCardsContainer.innerHTML = '';  // Clear existing jobs
        displayedJobs = 0;  // Reset displayed jobs count
        displayJobs();  // Re-render filtered jobs
    });
    // Helper function to check if a URL is valid
        const isValidUrl = (url) => {

            const regex = /^https:\/\/[^\s/$.?#].[^\s]*$/i;
          
            if(!regex.test(url)) {
                 return 'https://visajobs.xyz'+url;
            } else {
                return url.replace(/^\/https/, 'https');
                 // If an error occurs, it's an invalid URL
            }
        };
    // Function to calculate relative time
        const timeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
        ];
        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count >= 1) {
                return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
            }
        }
        return 'Just now';
    }

    // Fetch job data when the page loads
    fetchJobData();
});
