export interface ToolCall {
  name: string;
  args: Record<string, any>;
}

export interface ChatResponse {
  text: string;
  tool_calls: ToolCall[];
}

export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  tool_calls?: ToolCall[];
  timestamp: number;
}

export interface TimelineEvent {
  date: string;
  label: string;
  status: 'past' | 'current' | 'upcoming';
}

export interface TimelineData {
  phase: string;
  events: TimelineEvent[];
  show_calendar_button: boolean;
}

export interface BoothSimulatorData {
  step: number;
  highlight_officer: string;
}

export interface ConstituencyMapData {
  mode: 'phases' | 'constituency';
  pin_code: string;
  constituency_name: string;
  highlight_phase: number;
}

export interface EVMExplainerData {
  highlight_part: 'ballot_unit' | 'control_unit' | 'vvpat' | 'all';
}

export interface MythBusterData {
  claim: string;
  verdict: 'TRUE' | 'FALSE' | 'PARTIALLY TRUE';
  explanation: string;
}

export interface BoothFinderData {
  pin_code: string;
  query: string;
  maps_api_key: string;
}

export interface CalendarPushData {
  events: { title: string; date: string; description: string }[];
  status: string;
}

export type WidgetType = 'timeline' | 'booth_simulator' | 'constituency_map' | 'evm_explainer' | 'myth_buster' | 'booth_finder' | 'calendar_push' | null;

export interface CanvasState {
  widget: WidgetType;
  data: any;
}
