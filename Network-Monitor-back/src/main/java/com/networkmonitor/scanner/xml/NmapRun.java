package com.networkmonitor.scanner.xml;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@JacksonXmlRootElement(localName = "nmaprun")
public class NmapRun {

    @JacksonXmlProperty(localName = "host")
    @JacksonXmlElementWrapper(useWrapping = false)
    private List<NmapHost> hosts;

}