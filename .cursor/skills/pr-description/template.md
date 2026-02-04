## PR: {{issue_number}} - {{title}}

### 📋 Summary

{{summary}}

---

### ✨ 주요 변경사항

{{#changes}}
#### {{index}}. {{title}}

{{#code}}
```{{language}}
{{content}}
```
{{/code}}

{{#table}}
| {{header1}} | {{header2}} | {{header3}} |
|------|------|------|
{{#rows}}
| {{col1}} | {{col2}} | {{col3}} |
{{/rows}}
{{/table}}

{{/changes}}

---

### 🏗️ 설계 결정

| 결정 | 선택 | 이유 |
|------|------|------|
{{#decisions}}
| {{decision}} | {{selected}} | {{reason}} |
{{/decisions}}

---

### 📁 파일 구조

```
{{file_structure}}
```

---

### ✅ 테스트 커버리지

{{#tests}}
- {{name}} ✓
{{/tests}}

---

### 📚 문서

{{#docs}}
- `{{path}}` - {{description}}
{{/docs}}

---

### 🔧 사용법

```{{usage_language}}
{{usage_code}}
```

---

### 🚀 향후 확장

{{extension_guide}}
