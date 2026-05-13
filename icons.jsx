// =========================================================================
// Vizit Design System — icons
// =========================================================================
// PNG glyphs from the brand icon set, rendered via CSS mask so they inherit
// `color` like a font icon. Drop-in compatible with the old inline-SVG API:
// <Icons.Home /> or {Icons.Home} both work, size defaults to 20px.

const Icon = ({ src, size = 20, className = '', style = {}, ...rest }) => (
  <span
    className={className}
    style={{
      display: 'inline-block',
      width: size,
      height: size,
      backgroundColor: 'currentColor',
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      flexShrink: 0,
      ...style,
    }}
    {...rest}
  />
);

const ICON_BASE = 'assets/icons/';
const mk = (file) => <Icon src={ICON_BASE + file} />;
// Sized icon helper — use when you need a non-default size inline.
const IconAt = ({ name, size = 20, style, ...rest }) => (
  <Icon src={ICON_BASE + name} size={size} style={style} {...rest} />
);

const Icons = {
  // Navigation + chrome
  Home:      mk('home-01.png'),
  Folder:    mk('collection.png'),
  Compass:   mk('compass.png'),
  BarChart:  mk('chart-sharp.png'),
  Settings:  mk('settings-01.png'),
  Users:     mk('users-01.png'),
  Bell:      mk('alert.png'),

  // Chevrons / arrows
  ChevronD:  mk('chevron-down.png'),
  ChevronR:  mk('chevron-right.png'),
  ChevronL:  mk('chevron-left.png'),
  ChevronU:  mk('chevron-up.png'),
  ChevronDD: mk('chevron-down-double.png'),
  ChevronRR: mk('chevron-right-double.png'),
  ChevronLL: mk('chevron-left-double.png'),
  ChevronUU: mk('chevron-up-double.png'),
  ArrowUp:   mk('arrow-narrow-up.png'),
  ArrowDown: mk('arrow-narrow-down.png'),
  ArrowLeft: mk('arrow-narrow-left.png'),
  ArrowRight:mk('arrow-narrow-right.png'),
  ArrowUpRight: mk('arrow-narrow-up-right.png'),

  // Actions
  Search:    mk('search-sm.png'),
  Plus:      mk('plus.png'),
  Minus:     mk('minus.png'),
  Check:     mk('checkmark.png'),
  X:         mk('x-close.png'),
  XCircle:   mk('x-circle.png'),
  Upload:    mk('upload.png'),
  UploadCloud: mk('upload-cloud-02.png'),
  Download:  mk('download.png'),
  Copy:      mk('copy-01.png'),
  Share:     mk('share.png'),
  Trash:     mk('trash-01.png'),
  Edit:      mk('edit-02.png'),
  EditAlt:   mk('edit-03.png'),
  EditCompare: mk('edit-compare.png'),
  Refresh:   mk('refresh-cw-04.png'),
  Lock:      mk('lock.png'),
  LogIn:     mk('log-in-01.png'),
  LogOut:    mk('log-out-1.png'),
  Mail:      mk('mail-01.png'),
  Fullscreen:mk('arrows-fullscreen.png'),

  // Content / media
  Image:     mk('image.png'),
  ImageX:    mk('image-x.png'),
  ImageSpark:mk('image-spark.png'),
  MagicWand: mk('magic-wand.png'),
  Sparkle:   mk('star-06.png'),
  Zap:       mk('lightbulb.png'),
  Eye:       mk('eye.png'),
  Star:      mk('star-06.png'),
  Book:      mk('book-sharp.png'),
  Clipboard: mk('clipboard.png'),
  Building:  mk('building-06.png'),
  Beaker:    mk('beaker.png'),
  Rocket:    mk('rocket-02.png'),
  Lightbulb: mk('lightbulb.png'),
  Crosshair: mk('crosshair.png'),
  Rewind:    mk('rewind-clock.png'),
  ThumbsUp:  mk('thumbs-up.png'),
  ThumbsDown:mk('thumbs-down.png'),

  // People
  User:      mk('user-01.png'),
  UserPlus:  mk('user-plus-01.png'),
  UserMinus: mk('user-minus-01.png'),
  UserSettings: mk('user-settings.png'),

  // Overflow / handles
  Dots:      mk('dots-vertical.png'),
  DotsH:     mk('dots-handle.png'),
  Handle:    mk('dots-handle.png'),

  // Status
  Info:      mk('info-circle.png'),
  Alert:     mk('alert.png'),
  Help:      mk('help-circle.png'),

  // Legacy aliases kept for compatibility
  Filter:    mk('collection.png'),  // no dedicated filter glyph in set; fallback
  Grid:      mk('collection.png'),
  List:      mk('chart-sharp.png'),
  Layers:    mk('collection.png'),
};

Object.assign(window, { Icon, IconAt, Icons });
