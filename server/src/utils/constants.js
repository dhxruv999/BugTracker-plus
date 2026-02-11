const ROLES = ['org_admin', 'project_admin', 'developer', 'tester']
const ROLE_LABELS = {
  org_admin: 'Org Admin',
  project_admin: 'Project Admin',
  developer: 'Developer',
  tester: 'Tester'
}
const ROLE_RANK = {
  org_admin: 3,
  project_admin: 2,
  developer: 1,
  tester: 1
}
const USER_STATUSES = ['pending', 'active']
const BUG_STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed', 'Reopened']
const BUG_PRIORITIES = ['Low', 'Medium', 'High', 'Critical']

module.exports = {
  ROLES,
  ROLE_LABELS,
  ROLE_RANK,
  USER_STATUSES,
  BUG_STATUSES,
  BUG_PRIORITIES
}
