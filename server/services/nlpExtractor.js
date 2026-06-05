// Comprehensive skills dictionary - 500+ skills across multiple categories

// Programming Languages
const LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'c', 'c++', 'c#', 'ruby', 'go', 'rust',
  'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'lua', 'dart', 'elixir',
  'haskell', 'clojure', 'f#', 'objective-c', 'groovy', 'shell', 'bash', 'powershell',
  'assembly', 'fortran', 'cobol', 'pascal', 'delphi', 'vb', 'visual basic', 'prolog',
  'lisp', 'scheme', 'erlang', 'ocaml', 'julia', 'coffeescript', 'julia', 'nim',
  'zig', 'solidity', 'vyper', 'move', 'plsql', 'tsql', 'plpgsl', 'graphql', 'json',
  'xml', 'yaml', 'toml', 'markdown', 'latex', 'sql', 'html', 'css', 'scss', 'sass',
  'less', 'graphql', 'rest', 'grpc', 'thrift', 'protobuf', 'avro'
]

// Frontend Frameworks & Libraries
const FRONTEND = [
  'react', 'reactjs', 'react native', 'nextjs', 'next.js', 'angular', 'angularjs', 'vue',
  'vuejs', 'vue.js', 'nuxt', 'nuxtjs', 'svelte', 'sveltekit', 'ember', 'backbone',
  'jquery', 'bootstrap', 'tailwind', 'material-ui', 'mui', 'ant design', 'chakra',
  'styled-components', 'emotion', 'sass', 'less', 'webpack', 'vite', 'rollup', 'esbuild',
  'parcel', 'gatsby', 'astro', 'solid', 'solidjs', 'qwik', 'remix', 'blitz'
]

// Backend Frameworks & Runtime
const BACKEND = [
  'node', 'nodejs', 'express', 'expressjs', 'nest', 'nestjs', 'fastify', 'koa', 'hapi',
  'sails', 'loopback', 'feathers', 'strapi', 'django', 'flask', 'fastapi', 'pyramid',
  'bottle', 'tornado', 'web2py', 'cherrypy', 'spring', 'springboot', 'spring boot',
  'spring MVC', 'jhipster', 'quarkus', 'micronaut', 'play', 'play framework', 'laravel',
  'symfony', 'codeigniter', 'cakephp', 'yii', 'zend', 'phalcon', 'slim', 'slim framework',
  'fat-free', 'lumen', 'adonis', 'nest', 'fastify', 'echo', 'gin', 'beego', 'iris',
  'fiber', 'chi', 'buffalo', 'echo', 'revel', 'martini', 'gocraft', 'gorilla'
]

// Databases
const DATABASES = [
  'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'elasticsearch', 'elasticsearch',
  'cassandra', 'couchdb', 'couchbase', 'dynamodb', 'firebase', 'supabase', 'neon',
  'planetscale', 'cockroachdb', 'cockroach', 'mariadb', 'sqlite', 'oracle', 'mssql',
  'sql server', 'ibm db2', 'informix', 'sybase', 'teradata', 'snowflake', 'bigquery',
  'redshift', 'athena', 'hive', 'hbase', 'impala', 'presto', 'trino', 'druid', 'kudu',
  'timeseriesdb', 'influxdb', 'timescaledb', 'questdb', 'clickhouse', 'scylladb',
  'arangodb', 'neo4j', 'orientdb', 'graphdb', 'nebula', 'dgraph', 'janusgraph',
  'memcached', 'aerospike', ' Hazelcast', 'ignite', 'tarantool', 'foundationdb'
]

// Cloud & DevOps
const CLOUD_DEVOPS = [
  'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'google cloud platform',
  'heroku', 'digitalocean', 'linode', 'vultr', 'cloudflare', 'netlify', 'vercel',
  'render', 'fly', ' Railway', 'platform.sh', 'openshift', 'cloud foundry', 'cloud Foundry',
  'docker', 'kubernetes', 'k8s', 'helm', 'terraform', 'ansible', 'puppet', 'chef',
  'saltstack', 'vagrant', 'packer', 'consul', 'vault', 'nomad', 'traefik', 'envoy',
  'istio', 'linkerd', 'service mesh', 'jenkins', 'gitlab ci', 'github actions', 'circleci',
  'travis ci', 'bamboo', 'teamcity', 'azure devops', 'aws codebuild', 'codebuild',
  'code pipeline', 'cloudbuild', 'argocd', 'flux', 'spinnaker', 'tekton', 'drone',
  'buildkite', 'semaphore', 'codemagic', 'fastlane', 'appcenter', 'snyk', 'trivy',
  'anchore', 'clair', 'falco', 'opa', 'open policy agent', 'falco', 'sysdig'
]

// Data Science & ML
const DATA_ML = [
  'machine learning', 'deep learning', 'artificial intelligence', 'ai', 'ml', 'dl',
  'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'sklearn', 'pandas', 'numpy',
  'scipy', 'matplotlib', 'seaborn', 'plotly', 'bokeh', 'jupyter', 'notebook',
  'spark', 'pyspark', 'hadoop', 'hdfs', 'mapreduce', 'yarn', 'hive', 'pig',
  'airflow', 'luigi', 'dagster', ' Prefect', 'mlflow', 'kubeflow', 'tensorboard',
  'Weights & Biases', 'wandb', 'neptune', 'comet', 'mlflow', 'optuna', 'ray',
  'xgboost', 'lightgbm', 'catboost', 'caret', 'h2o', 'auto ml', 'automl',
  'nlp', 'natural language processing', 'text mining', 'sentiment analysis',
  'nltk', 'spacy', 'transformers', 'huggingface', 'bert', 'gpt', 'llm', 'large language model',
  'computer vision', 'opencv', 'pillow', 'scikit-image', 'yolo', 'rcnn', 'mask rcnn',
  'fast r-cnn', 'ssd', 'detectron', 'torchvision', 'caffe', 'caffe2', 'onnx',
  'tensorflow lite', 'tflite', 'coreml', 'mlkit', 'face detection', 'object detection',
  'image segmentation', 'style transfer', 'gan', 'vae', 'diffusion', 'stable diffusion',
  'reinforcement learning', 'rl', 'openai gym', 'baselines', 'ray rllib',
  'statistics', 'probability', 'regression', 'classification', 'clustering',
  'dimensionality reduction', 'feature engineering', 'hyperparameter tuning',
  'cross validation', 'a/b testing', 'statistical analysis', 'anova', 'hypothesis testing',
  'bayesian', 'time series', 'forecasting', 'arima', 'prophet', 'statsmodels'
]

// Testing
const TESTING = [
  'testing', 'unit testing', 'integration testing', 'e2e', 'end-to-end testing',
  'functional testing', 'performance testing', 'load testing', 'stress testing',
  'security testing', 'penetration testing', 'automated testing', 'manual testing',
  'test driven development', 'tdd', 'behavior driven development', 'bdd',
  'jest', 'mocha', 'jasmine', 'karma', 'cypress', 'playwright', 'puppeteer',
  'selenium', 'webdriver', 'appium', 'detox', 'espresso', 'xcuitest', 'robot framework',
  'testng', 'junit', 'pytest', 'unittest', 'nose', 'behave', 'cucumber', 'specflow',
  'nunit', 'xunit', 'mstest', 'phpunit', 'pytest', 'doctest', 'simple test',
  'codeception', 'atoum', 'kahlan', 'peridot', 'mockito', 'jest mock', 'sinon',
  'chai', 'assertj', 'hamcrest', 'mockk', 'mocktail', 'fakeiteasy', 'nsubstitute',
  'wiremock', 'mock server', 'postman', 'insomnia', 'rest assured', 'soapui',
  'jmeter', 'locust', 'k6', 'gatling', 'artillery', 'new relic', 'datadog', 'sentry'
]

// Security
const SECURITY = [
  'security', 'cybersecurity', 'infosec', 'information security', 'appsec', 'application security',
  'network security', 'cloud security', 'devsecops', 'secure coding', 'owasp', 'owasp top 10',
  'xss', 'sql injection', 'csrf', 'cors', 'x-frame-options', 'content security policy',
  'csp', 'https', 'tls', 'ssl', 'encryption', 'hashing', 'bcrypt', 'argon2', 'scrypt',
  'jwt', 'json web token', 'oauth', 'oauth2', 'openid connect', 'saml', 'ldap', 'active directory',
  'rbac', 'abac', 'role based access', 'permission', 'authorization', 'authentication',
  'mfa', '2fa', 'totp', 'sms', 'email verification', 'passwordless', 'biometric',
  'penetration testing', 'pentest', 'vulnerability assessment', 'security audit', 'code review',
  'static analysis', 'sast', 'dynamic analysis', 'dast', 'sca', 'software composition analysis',
  'dependency check', 'snyk', 'npm audit', 'dependabot', 'renovate', 'trivy', 'clair',
  'anchore', 'falco', 'sysdig', 'osquery', 'wazuh', 'suricata', 'zeek', 'bro',
  'siem', 'splunk', 'elastic', 'qradar', 'arcsight', 'threat hunting', 'incident response',
  'forensics', 'malware', 'ransomware', 'phishing', 'social engineering', 'ddos'
]

// Tools & IDE
const TOOLS = [
  'git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial', 'perforce', 'tfs', 'vsts',
  'vs code', 'visual studio code', 'visual studio', 'intellij', 'webstorm', 'phpstorm',
  'pycharm', 'datagrip', 'clion', 'rider', 'goland', 'rubymine', 'appcode', 'ide',
  'figma', 'sketch', 'adobe xd', 'invision', 'zeplin', 'marvel', 'framer', 'principle',
  'photoshop', 'illustrator', 'indesign', 'after effects', 'premiere', 'lightroom',
  'affinity', 'gimp', 'inkscape', 'blender', 'cinema 4d', 'maya', '3ds max', 'zbrush',
  'postman', 'insomnia', 'swagger', 'openapi', 'postman', 'jmeter', 'soapui',
  'docker desktop', 'docker compose', 'docker swarm', 'portainer', 'rancher', 'k9s',
  'k9s', 'stern', 'kubectx', 'kubens', 'kail', 'skaffold', 'tilt', 'devspace',
  'snyk', 'sonar', 'sonarqube', 'sonarlint', 'eslint', 'prettier', 'tslint', 'pylint',
  'flake8', 'black', 'pre-commit', 'husky', 'lint-staged', 'commitizen', 'conventional commits'
]

// Soft Skills
const SOFT_SKILLS = [
  'communication', 'written communication', 'verbal communication', 'presentation',
  'public speaking', 'interpersonal', 'leadership', 'team leadership', 'mentoring',
  'coaching', 'teamwork', 'collaboration', 'cross-functional', 'stakeholder management',
  'problem solving', 'analytical', 'critical thinking', 'decision making',
  'time management', 'prioritization', 'organization', 'planning', 'project management',
  'agile', 'scrum', 'kanban', 'sprint planning', 'backlog grooming', 'retrospectives',
  'adaptability', 'flexibility', 'change management', 'resilience', 'stress management',
  'creativity', 'innovation', 'innovative', 'strategic thinking', 'business acumen',
  'customer focus', 'client facing', 'consulting', 'negotiation', 'conflict resolution',
  'attention to detail', 'quality assurance', 'continuous improvement', 'kaizen',
  'accountability', 'ownership', 'initiative', 'proactive', 'self-motivated',
  'learning agility', 'growth mindset', 'teachable', 'curious', 'research',
  'documentation', 'technical writing', 'process improvement', 'optimization'
]

// Methodologies
const METHODOLOGIES = [
  'agile', 'scrum', 'kanban', 'lean', 'six sigma', 'waterfall', 'prince2', 'pmp',
  'pmi', 'safe', 'scaled agile', 'safe', 'leSS', 'less', 'devops', 'devsecops',
  'sre', 'site reliability engineering', 'ci/cd', 'continuous integration',
  'continuous delivery', 'continuous deployment', 'gitops', 'infrastructure as code',
  'iac', 'configuration management', 'microservices', 'monolith', 'service-oriented',
  'soa', 'event-driven', 'eda', 'domain-driven design', 'ddd', 'test-driven development',
  'tdd', 'behavior-driven development', 'bdd', 'acceptance test-driven development', 'atdd',
  'pair programming', 'mob programming', 'code review', 'peer review', 'technical debt',
  'refactoring', 'clean code', 'solid principles', 'design patterns', 'architecture patterns',
  'restful', 'rest', 'graphql', 'grpc', 'webhooks', 'event sourcing', 'cqrs'
]

// Big Data & Analytics
const BIG_DATA = [
  'big data', 'hadoop', 'spark', 'hdfs', 'mapreduce', 'yarn', 'hive', 'pig', 'sqoop',
  'flume', 'kafka', 'storm', 'flink', 'beam', 'airflow', 'luigi', 'dagster', ' Prefect',
  'etl', 'elt', 'data pipeline', 'data warehouse', 'data lake', 'data mesh', 'data lakehouse',
  'snowflake', 'redshift', 'bigquery', 'synapse', 'databricks', 'emr', 'data pipeline',
  'dbt', 'dataform', 'looker', 'tableau', 'power bi', 'metabase', 'superset', 'redash',
  'grafana', 'kibana', 'elasticsearch', 'logstash', 'beats', 'splunk', 'sumologic',
  'data governance', 'data quality', 'data lineage', 'data catalog', 'data mesh',
  'master data management', 'mdm', 'data integration', 'api gateway', 'event streaming'
]

// Mobile Development
const MOBILE = [
  'ios', 'android', 'mobile', 'react native', 'flutter', 'xamarin', 'ionic', 'cordova',
  'phonegap', 'capacitor', 'native', 'swift', 'objective-c', 'kotlin', 'java',
  'dart', 'jetpack compose', 'swiftui', 'uikit', 'swiftui', 'material design',
  'cocoapods', 'carthage', 'gradle', 'maven', 'android studio', 'xcode',
  'app store', 'google play', 'firebase', 'crashlytics', 'sentry', 'testflight',
  'beta testing', 'app signing', 'proguard', 'r8', 'obfuscation', 'mobile saas'
]

// APIs & Integration
const API_INTEGRATION = [
  'api', 'rest', 'restful', 'graphql', 'grpc', 'webhook', 'soap', 'xml', 'json',
  'openapi', 'swagger', 'postman', 'insomnia', 'api gateway', 'kong', 'apigee',
  'aws api gateway', 'azure api management', 'google cloud endpoints', 'tyk',
  'express gateway', 'traefik', 'oauth', 'oauth2', 'jwt', 'api key', 'rate limiting',
  'throttling', 'caching', 'redis', 'memcached', 'cdn', 'cloudflare', 'fastly',
  'webhook', 'integration', 'webhook', 'zapier', 'make', 'integromat', 'n8n',
  'serverless', 'lambda', 'azure functions', 'google cloud functions', 'cloud functions',
  'firebase functions', 'openfaas', 'knative', 'fn project'
]

// Combine all skills
const ALL_SKILLS = [
  ...LANGUAGES, ...FRONTEND, ...BACKEND, ...DATABASES, ...CLOUD_DEVOPS,
  ...DATA_ML, ...TESTING, ...SECURITY, ...TOOLS, ...SOFT_SKILLS,
  ...METHODOLOGIES, ...BIG_DATA, ...MOBILE, ...API_INTEGRATION
]

// Education keywords
const EDUCATION_KEYWORDS = [
  'bachelor', 'master', 'phd', 'doctorate', 'degree', 'university', 'college',
  'institute', 'school', 'academy', 'computer science', 'engineering', 'business',
  'mathematics', 'physics', 'chemistry', 'biology', 'economics', 'psychology',
  'gpa', 'graduated', 'graduation', 'dean', 'honors', 'magna cum laude', 'summa cum laude',
  'certification', 'certificate', 'training', 'course', 'bootcamp', 'online course',
  'mooc', 'coursera', 'udemy', 'edx', 'nanodegree', 'professional certificate',
  'google certified', 'aws certified', 'microsoft certified', 'oracle certified',
  'comptia', 'cisco', 'pmp', 'scrum master', 'agile certified', 'itil', 'six sigma'
]

// Experience keywords
const EXPERIENCE_KEYWORDS = [
  'experience', 'worked', 'responsible', 'managed', 'developed', 'created', 'implemented',
  'designed', 'led', 'coordinated', 'achieved', 'improved', 'reduced', 'increased',
  'optimized', 'collaborated', 'delivered', 'executed', 'performed', 'conducted',
  'analyzed', 'evaluated', 'assessed', 'reviewed', 'audited', 'tested', 'deployed',
  'maintained', 'supported', 'troubleshot', 'resolved', 'debugged', 'refactored',
  'restructured', 'reengineered', 'transformed', 'modernized', 'migrated', 'integrated',
  'automated', 'streamlined', 'scaled', 'built', 'launched', 'released', 'shipped',
  'team', 'project', 'client', 'stakeholder', 'budget', 'deadline', 'sprint', 'iteration',
  'senior', 'junior', 'lead', 'principal', 'architect', 'staff', 'engineer', 'developer',
  'manager', 'director', 'vp', 'vice president', 'chief', 'head', 'consultant', 'analyst',
  'specialist', 'coordinator', 'administrator', 'supervisor', 'foreman', 'associate',
  'intern', 'trainee', 'contractor', 'freelancer', 'vendor', 'partner'
]

// Skills by category for detailed extraction
export const SKILL_CATEGORIES = {
  languages: LANGUAGES,
  frontend: FRONTEND,
  backend: BACKEND,
  databases: DATABASES,
  cloudDevops: CLOUD_DEVOPS,
  dataML: DATA_ML,
  testing: TESTING,
  security: SECURITY,
  tools: TOOLS,
  softSkills: SOFT_SKILLS,
  methodologies: METHODOLOGIES,
  bigData: BIG_DATA,
  mobile: MOBILE,
  apiIntegration: API_INTEGRATION
}

export const extractSkills = (text) => {
  const lowerText = text.toLowerCase()
  const foundSkills = new Set()

  // Check all skills
  for (const skill of ALL_SKILLS) {
    // Use word boundary matching to avoid partial matches
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    if (regex.test(lowerText)) {
      foundSkills.add(skill)
    }
  }

  return Array.from(foundSkills)
}

export const extractSkillsByCategory = (text) => {
  const lowerText = text.toLowerCase()
  const result = {}

  for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
    const found = []
    for (const skill of skills) {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
      if (regex.test(lowerText)) {
        found.push(skill)
      }
    }
    result[category] = found
  }

  return result
}

export const extractEducation = (text) => {
  const lowerText = text.toLowerCase()
  const education = []

  // Split text into lines
  const lines = text.split('\n')

  for (const line of lines) {
    const lowerLine = line.toLowerCase()
    let matched = false

    for (const keyword of EDUCATION_KEYWORDS) {
      if (lowerLine.includes(keyword)) {
        matched = true
        break
      }
    }

    if (matched && line.trim().length > 10) {
      education.push(line.trim())
    }
  }

  return education.slice(0, 5) // Limit to 5 entries
}

export const extractExperience = (text) => {
  const lines = text.split('\n')
  const experience = []

  for (const line of lines) {
    const lowerLine = line.toLowerCase()
    let matched = false

    for (const keyword of EXPERIENCE_KEYWORDS) {
      if (lowerLine.includes(keyword)) {
        matched = true
        break
      }
    }

    if (matched && line.trim().length > 15) {
      experience.push(line.trim())
    }
  }

  return experience.slice(0, 8) // Limit to 8 entries
}

export default { extractSkills, extractEducation, extractExperience }