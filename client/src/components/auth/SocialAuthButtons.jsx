import React from 'react'
import { Button } from '@/components/ui'
import { cn } from '@/utils/helpers'

function GoogleIcon({ className }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.805 12.227c0-.818-.073-1.604-.209-2.364H12v4.473h5.49a4.694 4.694 0 0 1-2.036 3.082v2.56h3.298c1.93-1.777 3.053-4.4 3.053-7.751Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.754 0 5.062-.914 6.75-2.477l-3.298-2.56c-.914.614-2.082.977-3.452.977-2.648 0-4.892-1.786-5.694-4.186H2.896v2.642A9.998 9.998 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.306 13.754A5.995 5.995 0 0 1 6 12c0-.61.105-1.2.306-1.754V7.604H2.896A9.998 9.998 0 0 0 2 12c0 1.611.386 3.137 1.096 4.396l3.21-2.642Z"
        fill="#FBBC04"
      />
      <path
        d="M12 6.06c1.498 0 2.844.515 3.902 1.526l2.926-2.926C17.058 3.01 14.752 2 12 2A9.998 9.998 0 0 0 2.896 7.604l3.41 2.642C7.108 7.846 9.352 6.06 12 6.06Z"
        fill="#EA4335"
      />
    </svg>
  )
}

function GithubIcon({ className }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.477 2 2 6.59 2 12.25c0 4.528 2.865 8.37 6.839 9.727.5.096.682-.222.682-.494 0-.244-.009-.892-.014-1.75-2.782.62-3.37-1.375-3.37-1.375-.455-1.18-1.11-1.494-1.11-1.494-.908-.637.069-.624.069-.624 1.004.072 1.532 1.054 1.532 1.054.892 1.563 2.341 1.112 2.91.85.09-.667.349-1.112.635-1.368-2.221-.261-4.555-1.138-4.555-5.062 0-1.118.389-2.033 1.029-2.75-.104-.261-.446-1.313.097-2.736 0 0 .84-.277 2.75 1.05A9.303 9.303 0 0 1 12 6.909c.85.004 1.707.117 2.506.345 1.909-1.327 2.748-1.05 2.748-1.05.544 1.423.202 2.475.099 2.736.64.717 1.027 1.632 1.027 2.75 0 3.934-2.338 4.798-4.566 5.055.359.318.679.945.679 1.905 0 1.375-.012 2.484-.012 2.822 0 .274.18.595.688.493A10.254 10.254 0 0 0 22 12.25C22 6.59 17.523 2 12 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function SocialAuthButtons({
  className,
  disabled = false,
  mode = 'login',
  onGoogleClick,
  onGithubClick,
}) {
  const buttonLabelPrefix = mode === 'register' ? 'Sign up with' : 'Continue with'

  return (
    <div className={cn('space-y-3', className)}>
      <Button
        type="button"
        variant="outline"
        className="w-full gap-3 border-border/70 bg-background/80"
        disabled={disabled}
        onClick={onGoogleClick}
      >
        <GoogleIcon className="h-5 w-5 shrink-0" />
        <span>{buttonLabelPrefix} Google</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full gap-3 border-border/70 bg-background/80 text-foreground"
        disabled={disabled}
        onClick={onGithubClick}
      >
        <GithubIcon className="h-5 w-5 shrink-0" />
        <span>{buttonLabelPrefix} GitHub</span>
      </Button>
      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/60" />
        </div>
        <span className="relative flex justify-center text-xs uppercase tracking-[0.24em] text-muted-foreground">
          or use email instead
        </span>
      </div>
    </div>
  )
}
