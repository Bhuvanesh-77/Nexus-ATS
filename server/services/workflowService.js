import EventEmitter from 'events';

class WorkflowEmitter extends EventEmitter { }
const workflowEvents = new WorkflowEmitter();

// Action Listeners
workflowEvents.on('applicationStatusChanged', (data) => {
    const { application, prevStatus, newStatus } = data;
    console.log(`[WORKFLOW] Application ${application._id} status changed from ${prevStatus} to ${newStatus}`);

    // Automated Triggers
    if (newStatus === 'Rejected') {
        triggerRejectionEmail(application);
    } else if (newStatus === 'Interview') {
        triggerInterviewSchedule(application);
    }
});

workflowEvents.on('newApplication', (application) => {
    console.log(`[WORKFLOW] New application received for job: ${application.job}`);
    trackAnalytics(application);
});

// Mock External Integrations
const triggerRejectionEmail = (app) => {
    console.log(`[EMAIL] Sending automated rejection email to candidate for job ID: ${app.job}`);
};

const triggerInterviewSchedule = (app) => {
    console.log(`[INVITE] Sending Calendly link to candidate for job ID: ${app.job}`);
};

const trackAnalytics = (app) => {
    console.log(`[ANALYTICS] Syncing application details to external HRIS/BigData...`);
};

export default workflowEvents;
