/**
 * Typography Components
 *
 * A collection of typography-related components.
 * Provides various styling and animation features for text presentation.
 */

// FitText - Automatically scales size to fit the container width
export { FitText } from './FitText.jsx';

// Title - Hierarchical title system for sections/items
export { Title } from './Title.jsx';

// HighlightedTypography - Text emphasis effects (underline, background, marker, circle)
export { HighlightedTypography, Highlight } from './HighlightedTypography.jsx';

// StretchedHeadline - Hero typography that fills the full width by stretching word spacing
export { StretchedHeadline, StretchedHeadlineMultiline } from './StretchedHeadline.jsx';

// InlineTypography - Insert images/icons within text
export {
  InlineTypography,
  InlineObject,
  InlineIcon,
  InlineImage,
} from './InlineTypography.jsx';

// StyledParagraph - Styled paragraph (Quote)
export {
  StyledParagraph,
  PullQuote,
} from './StyledParagraph.jsx';

// QuotedContainer - Quotation with decorative quote marks
export { QuotedContainer } from './QuotedContainer.jsx';
