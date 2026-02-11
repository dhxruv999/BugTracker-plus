const canAccessBug = (user, bug) => {
  if (!user || !bug) return false
  if (user.role === 'Admin') return true
  if (user.role === 'Developer') return bug.assigned_to === user.id
  if (user.role === 'Tester') return bug.created_by === user.id || bug.assigned_to === user.id
  return false
}

module.exports = {
  canAccessBug
}
