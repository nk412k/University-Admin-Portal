
CREATE OR REPLACE FUNCTION get_exam_reports_with_details()
RETURNS TABLE (
  id uuid,
  university_id uuid,
  university_name text,
  section_id uuid,
  section_name text,
  subject_id uuid,
  subject_name text,
  event_id uuid,
  report_name text,
  report_date date,
  exam_date date,
  max_marks numeric,
  pass_marks numeric,
  status text,
  created_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    er.id,
    er.university_id,
    u.name AS university_name,
    er.section_id,
    s.name AS section_name,
    er.subject_id,
    sub.name AS subject_name,
    er.event_id,
    er.report_name,
    er.report_date,
    er.exam_date,
    er.max_marks,
    er.pass_marks,
    er.status,
    er.created_at
  FROM
    public.exam_reports er
  JOIN
    public.universities u ON er.university_id = u.university_id
  JOIN
    public.sections s ON er.section_id = s.section_id
  JOIN
    public.subjects sub ON er.subject_id = sub.subject_id
  ORDER BY
    er.report_date DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_exam_report_by_id(report_id uuid)
RETURNS TABLE (
  id uuid,
  university_id uuid,
  university_name text,
  section_id uuid,
  section_name text,
  subject_id uuid,
  subject_name text,
  event_id uuid,
  report_name text,
  report_date date,
  exam_date date,
  max_marks numeric,
  pass_marks numeric,
  status text,
  created_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    er.id,
    er.university_id,
    u.name AS university_name,
    er.section_id,
    s.name AS section_name,
    er.subject_id,
    sub.name AS subject_name,
    er.event_id,
    er.report_name,
    er.report_date,
    er.exam_date,
    er.max_marks,
    er.pass_marks,
    er.status,
    er.created_at
  FROM
    public.exam_reports er
  JOIN
    public.universities u ON er.university_id = u.university_id
  JOIN
    public.sections s ON er.section_id = s.section_id
  JOIN
    public.subjects sub ON er.subject_id = sub.subject_id
  WHERE
    er.id = report_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_exam_report_details(report_id uuid)
RETURNS TABLE (
  id uuid,
  student_id uuid,
  student_name text,
  roll_number text,
  marks_obtained numeric,
  grade text,
  remarks text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    erd.id,
    erd.student_id,
    s.name AS student_name,
    s.roll_number,
    erd.marks_obtained,
    erd.grade,
    erd.remarks
  FROM
    public.exam_report_details erd
  JOIN
    public.students s ON erd.student_id = s.student_id
  WHERE
    erd.report_id = report_id;
END;
$$ LANGUAGE plpgsql;
