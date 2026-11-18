const KEY = 'cs_pending_template_id'

export function setPendingTemplateId(templateId) {
  sessionStorage.setItem(KEY, templateId)
}

export function consumePendingTemplateId() {
  const id = sessionStorage.getItem(KEY)
  if (id) sessionStorage.removeItem(KEY)
  return id
}
